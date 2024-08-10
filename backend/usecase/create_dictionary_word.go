package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/hello-world/domain/db"
	"example.com/hello-world/usecase/input"
	"github.com/google/uuid"
)

func CreateDictionaryWord(ctx context.Context, input input.NotNumberDictionaryWord) (int, error) {
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

	// 重複しない項目のパーティションキーを作成
	number := int(uuid.New().ID())

	// dbに保存するデータをセット
	createDictionaryWord := &db.DictionaryWord{
		Number:      number,
		Word:        input.Word,
		Description: input.Description,
		Category:    input.Category,
		Video:       input.Video,
	}

	// dbに保存
	dictionaryWordRepo, statusCode, err := db.NewDictionaryWordRepo()
	if err != nil {
		return statusCode, nil
	}
	statusCode, err = dictionaryWordRepo.CreatOrUpdate(*createDictionaryWord)
	if err != nil {
		return statusCode, nil
	}

	return http.StatusOK, nil
}
