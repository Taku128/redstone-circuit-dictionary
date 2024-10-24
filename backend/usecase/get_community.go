package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
)

func GetCommunity(ctx context.Context, edition string) (*[]db.Community, int, error) {
	communityRepo := db.NewCommunityRepo()
	edition = "bedrock"
	cummunities, statusCode, err := communityRepo.List(edition)
	if err != nil {
		return nil, statusCode, err
	}
	return cummunities, http.StatusOK, nil
}
