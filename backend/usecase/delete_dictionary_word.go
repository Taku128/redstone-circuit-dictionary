package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
)

func DeleteDictionaryWord(ctx context.Context, id int) (int, error) {
	dictionaryWordRepo := db.NewDictionaryWordRepo()
	statusCode, err := dictionaryWordRepo.Delete(id)
	if err != nil {
		return statusCode, err
	}

	return http.StatusOK, nil
}
