package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"example.com/hello-world/domain/db"
	"example.com/hello-world/usecase/input"
)

func UpdateDictionaryWord(ctx context.Context, input input.DictionaryWord, id int) (int, error) {
	var urls []string

	// 文字列から配列に置き換える
	if input.Video != "[]" {
		err := json.Unmarshal([]byte(input.Video), &urls)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to unmarshal input: %w", err)
		}
	}

	// URLのバリデーションと埋め込み式に変換する
	embedURLs, statusCode, err := db.ValidateAndConvertURLs(urls)
	if err != nil {
		return statusCode, err
	}

	if input.Poster == "" || input.Word == "" {
		return http.StatusBadRequest, fmt.Errorf("invalid dictionary word")
	}

	// 配列から文字列に置き換える
	result, err := json.Marshal(embedURLs)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("failed to unmarshal result: %w", err)
	}
	if input.Video == "" {
		input.Video = "[]"
	}
	if input.Video != "[]" {
		input.Video = string(result)
	}

	// 時間の取得
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("failed to load location: %w", err)
	}
	t := time.Now().In(loc)

	// dbに保存するデータをセット
	createDictionaryWord := &db.DictionaryWord{
		Number:      id,
		Word:        input.Word,
		Description: input.Description,
		Category:    input.Category,
		Video:       input.Video,
		Poster:      input.Poster,
		CreatedAt:   t.String(),
	}

	// dbに保存
	dictionaryWordRepo, statusCode, err := db.NewDictionaryWordRepo()
	if err != nil {
		return statusCode, nil
	}
	statusCode, err = dictionaryWordRepo.CreateOrUpdate(*createDictionaryWord)
	if err != nil {
		return statusCode, nil
	}

	return http.StatusOK, nil
}
