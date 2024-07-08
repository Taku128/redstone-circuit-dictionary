package usecase

import (
	"context"
	"net/http"

	"example.com/hello-world/domain/db"
)

func GetDictionaryWord(ctx context.Context, word string) (*[]db.DictionaryWord, int, error) {
	dictionaryWordRepo, statusCode, err := db.NewDictionaryWordRepo()
	if err != nil {
		return nil, statusCode, err
	}
	dictionaryWords, statusCode, err := dictionaryWordRepo.List(word)
	if err != nil {
		return nil, statusCode, err
	}

	return dictionaryWords, http.StatusOK, nil
}
