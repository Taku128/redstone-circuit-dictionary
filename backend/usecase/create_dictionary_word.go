package usecase

func CreateDictionaryWord(ctx context.Context, input DictionaryWord) error{
	var urls []string

	// 文字列から配列に置き換える
	if input.Video != "[]" {
		err = json.Unmarshal([]byte(input.Video), &urls)
		if err != nil {
			return fmt.Errorf("failed to unmarshal input: %w", err)
		}
	}

	// URLのバリデーションと埋め込み式に変換する
	embedURLs, err := db.validateAndConvertURLs(urls)
	if err != nil {
		return err
	}

	// 配列から文字列に置き換える
	result, err := json.Marshal(embedURLs)
	if err != nil {
		return fmt.Errorf("failed to unmarshal result: %w", err)
	}

	// 重複しない項目のパーティションキーを作成
	number := int(uuid.New().ID())

	// dbに保存するデータをセット
	createDictionaryWord := &DictionaryWord{
		Number: number,
		Word: input.Word,
		Description: input.description,
		Category: input.Category,
		video: input.Video,
	} 

	// dbに保存
	err = db.Create(createDictionaryWord)
	if err != nil {
		return err
	}

	return nil
}
