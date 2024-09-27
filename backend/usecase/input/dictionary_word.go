package input

type DictionaryWord struct {
	ID           int    `json:"id"`
	Word         string `json:"word"`
	Description  string `json:"description"`
	CategoryJson string `json:"category_json"`
	VideoJson    string `json:"video_json"`
	Poster       string `json:"poster"`
}
