package util

type Setting struct {
	AllowedOrigins      []string
	AWSRegion           string
	DictionaryWordTable DictionaryWordRepo
<<<<<<< Updated upstream
=======
	CommunityTable      CommunityRepo
	MessageTable        MessageRepo
	BucketName          string
>>>>>>> Stashed changes
}

type DictionaryWordRepo struct {
	TableName   string
	PosterIndex string
}

type CommunityRepo struct {
	TableName string
}

type MessageRepo struct {
	TableName string
}

func GetSetting() *Setting {
	devSetting := &Setting{
		AllowedOrigins: []string{"http://localhost:3000", "https://staging.d1631t3ap8rd8k.amplifyapp.com"},
		AWSRegion:      "ap-northeast-1",
		DictionaryWordTable: DictionaryWordRepo{
			TableName:   "dev-redstoneCircuitDictionary-words",
			PosterIndex: "poster_index",
		},
		CommunityTable: CommunityRepo{
			TableName: "dev-redstoneCircuitDictionary-cummunities",
		},
		MessageTable: MessageRepo{
			TableName: "dev-redstoneCircuitDictionary-messages",
		},
		BucketName: "dev-redstone-circuit-dictionary-files",
	}
	return devSetting
}
