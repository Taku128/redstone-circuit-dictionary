package usecase

func GetDictionaryWord(ctx context.Context) ([]*DictionaryWord, error) {
	var urls []string

	dictionaryWords, err := db.List()
	if err != nil {
		return nil, err
	}

	return dictionaryWords, nil
}
