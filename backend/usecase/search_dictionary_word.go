package usecase

func GetDictionaryWord(ctx context.Context, word string) ([]*DictionaryWord, error) {
	var urls []string

	dictionaryWords, err := db.SearchByContainedWord(word)
	if err != nil {
		return nil, err
	}

	return dictionaryWords, nil
}
