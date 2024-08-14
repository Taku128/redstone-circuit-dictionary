package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
)

func GetPosterDictionaryWord(ctx context.Context, poster string, from, to string) (*[]db.DictionaryWord, int, error) {
	dictionaryWordRepo, statusCode, err := db.NewDictionaryWordRepo()
	if err != nil {
		return nil, statusCode, err
	}
	dictionaryWords, statusCode, err := dictionaryWordRepo.SearchByPoster(poster, from, to)
	if err != nil {
		return nil, statusCode, err
	}

	return dictionaryWords, http.StatusOK, nil
}
