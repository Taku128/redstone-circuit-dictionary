package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
)

func GetPosterDictionaryWord(ctx context.Context, poster string, from, to string) (*[]db.DictionaryWord, int, error) {
	dictionaryWordRepo := db.NewDictionaryWordRepo()
	dictionaryWords, statusCode, err := dictionaryWordRepo.SearchByPoster(poster, from, to)
	if err != nil {
		return nil, statusCode, err
	}
	return dictionaryWords, http.StatusOK, nil
}
