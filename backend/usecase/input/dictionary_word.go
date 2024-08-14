package input

import "time"

type DictionaryWord struct {
	Number      int       `json:"number"`
	Word        string    `json:"word"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Video       string    `json:"video"`
	Poster      string    `json:"poster"`
	CreatedAt   time.Time `json:"created_at"`
}

type NotNumberDictionaryWord struct {
	Word        string    `json:"word"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Video       string    `json:"video"`
	Poster      string    `json:"poster"`
	CreatedAt   time.Time `json:"created_at"`
}
