package util

type Setting struct {
	AllowedOrigins []string
	AWSRegion      string
}

func GetSetting() *Setting {
	devSetting := &Setting{
		AllowedOrigins: []string{"http://localhost:3000", "https://staging.d1631t3ap8rd8k.amplifyapp.com"},
		AWSRegion:      "ap-northeast-1",
	}
	return devSetting
}
