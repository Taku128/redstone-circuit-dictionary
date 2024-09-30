package util

type Setting struct {
	AllowedOrigins      []string
	AWSRegion           string
	DictionaryWordTable DictionaryWordRepo
	BucketName          string
}

type DictionaryWordRepo struct {
	TableName   string
	PosterIndex string
}

func GetSetting() *Setting {
	devSetting := &Setting{
		AllowedOrigins: []string{"http://localhost:3000", "https://staging.d1631t3ap8rd8k.amplifyapp.com"},
		AWSRegion:      "ap-northeast-1",
		DictionaryWordTable: DictionaryWordRepo{
			TableName:   "dev-redstoneCircuitDictionary-words",
			PosterIndex: "poster_index",
		},
		BucketName: "dev-redstoneCircuitDictionary-files-upload",
	}
	return devSetting
}
