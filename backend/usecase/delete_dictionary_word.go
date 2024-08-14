package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
)

func DeleteDictionaryWord(ctx context.Context, id string) (int, error) {
	dictionaryWordRepo, statusCode, err := db.NewDictionaryWordRepo()
	if err != nil {
		return statusCode, err
	}
	statusCode, err = dictionaryWordRepo.Delete(id)
	if err != nil {
		return statusCode, err
	}

	return http.StatusOK, nil
}
