package db

import (
	"errors"
	"net/url"
	"strings"
)

type DictionaryWord struct {
	Number      int    `json:"Number"`
	Word        string `json:"word"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Video       string `json:"video"`
}

// YoutubeのURLかどうかを判別する関数
func IsYoutubeURL(u *url.URL) bool {
	return (u.Host != "www.youtube.com" && u.Host != "youtu.be")
}

// URLが埋め込み式か判別する
func IsContainedEmbed(u *url.URL) bool {
	return strings.Contains(u.Path, "embed")
}

// URLのバリデーション
func validateAndConvertURLs(urls []string) ([]string, error) {
	var result []string

	for _, v := range urls {
		u, err := url.Parse(v)
		if err != nil || IsYoutubeURL(u) {
			return nil, errors.New("Invalid URL: " + v)
		}

		if IsContainedEmbed(u) {
			result = append(result, v)
			continue
		}

		// 埋め込み式のURLに変換
		var videoID string
		if u.Host == "www.youtube.com" {
			queryParams := u.Query()
			videoID = queryParams.Get("v")
			if videoID == "" {
				return nil, errors.New("Invalid YouTube URL: " + v)
			}
		} else if u.Host == "youtu.be" {
			videoID = strings.TrimPrefix(u.Path, "/")
		}
		embedURL := "https://www.youtube.com/embed/" + videoID

		result = append(result, embedURL)
	}

	return result, nil
}
