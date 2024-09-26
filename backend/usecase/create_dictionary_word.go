package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/hello-world/domain/db"
	"example.com/hello-world/usecase/input"
	"example.com/hello-world/util"
	"github.com/google/uuid"
)

func CreateDictionaryWord(ctx context.Context, input input.DictionaryWord) (int, error) {
	var urls []string

	// 文字列から配列に置き換える
	if input.VideoJson != "[]" {
		err := json.Unmarshal([]byte(input.VideoJson), &urls)
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
	if input.VideoJson == "" {
		input.VideoJson = "[]"
	}
	if input.VideoJson != "[]" {
		input.VideoJson = string(result)
	}

	// 重複しない項目のパーティションキーを作成
	id := int(uuid.New().ID())

	// 時間の取得
	t, statusCode, err := util.TimeNow()
	if err != nil {
		return statusCode, err
	}

	// dbに保存するデータをセット
	createDictionaryWord := &db.DictionaryWord{
		ID:           id,
		Word:         input.Word,
		Description:  input.Description,
		CategoryJson: input.CategoryJson,
		VideoJson:    input.VideoJson,
		Poster:       input.Poster,
		CreatedAt:    t.String(),
	}

	// dbに保存
	dictionaryWordRepo := db.NewDictionaryWordRepo()
	statusCode, err = dictionaryWordRepo.CreateOrUpdate(createDictionaryWord)
	if err != nil {
		return statusCode, nil
	}

	return http.StatusOK, nil
}
