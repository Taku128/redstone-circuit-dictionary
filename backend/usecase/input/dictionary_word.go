package input

type DictionaryWord struct {
	Number      int    `json:"number"`
	Word        string `json:"word"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Video       string `json:"video"`
	Poster      string `json:"poster"`
}
