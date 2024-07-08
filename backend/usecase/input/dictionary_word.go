package usecase

type DictionaryWord struct {
	Number      int    `json:"Number"`
	Word        string `json:"word"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Video       string `json:"video"`
}
