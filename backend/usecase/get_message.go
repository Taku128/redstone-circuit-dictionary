package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
	"github.com/guregu/null"
)

func GetMessage(ctx context.Context, communityID, messageCount null.Int, userName, postUserName string) (*[]db.Message, int, error) {
	messageRepo := db.NewMessageRepo()
	messages, statusCode, err := messageRepo.List(communityID, messageCount, userName, postUserName)
	if err != nil {
		return nil, statusCode, err
	}
	return messages, http.StatusOK, nil
}
