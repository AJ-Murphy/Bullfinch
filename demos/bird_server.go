package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"slices"
	"time"
)

const defaultLimit = 20

var ErrNotFound = errors.New("sighting not found")

type Habitat string

const (
	Garden   Habitat = "garden"
	Wetland  Habitat = "wetland"
	Woodland Habitat = "woodland"
)

type Sighting struct {
	ID         int64     `json:"id"`
	Species    string    `json:"species"`
	Count      int       `json:"count"`
	Habitat    Habitat   `json:"habitat"`
	ObservedAt time.Time `json:"observedAt"`
}

type Repository interface {
	Recent(context.Context, int) ([]Sighting, error)
}

type MemoryRepository struct {
	sightings []Sighting
}

func (repository *MemoryRepository) Recent(_ context.Context, limit int) ([]Sighting, error) {
	result := slices.Clone(repository.sightings)
	slices.SortFunc(result, func(left, right Sighting) int {
		return right.ObservedAt.Compare(left.ObservedAt)
	})

	if limit < len(result) {
		result = result[:limit]
	}
	return result, nil
}

type Server struct {
	repository Repository
	logger     *slog.Logger
}

func (server *Server) sightings(response http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		http.Error(response, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sightings, err := server.repository.Recent(request.Context(), defaultLimit)
	if err != nil {
		server.logger.Error("load sightings", "error", err)
		http.Error(response, "could not load sightings", http.StatusInternalServerError)
		return
	}

	response.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(response).Encode(sightings); err != nil {
		server.logger.Warn("encode response", "error", err)
	}
}

func main() {
	repository := &MemoryRepository{sightings: []Sighting{
		{ID: 1, Species: "Eurasian bullfinch", Count: 2, Habitat: Garden, ObservedAt: time.Now()},
		{ID: 2, Species: "Common kingfisher", Count: 1, Habitat: Wetland, ObservedAt: time.Now().Add(-time.Hour)},
	}}
	server := &Server{repository: repository, logger: slog.Default()}

	http.HandleFunc("GET /api/sightings", server.sightings)
	address := ":8080"
	fmt.Printf("Listening on http://localhost%s\n", address)
	if err := http.ListenAndServe(address, nil); err != nil {
		server.logger.Error("server stopped", "error", err)
	}
}
