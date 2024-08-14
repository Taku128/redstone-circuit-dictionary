package cognito

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

const (
	// cognitoUserPoolId = "ap-northeast-1_THl6NTtRB"
	cognitoRegion = "ap-northeast-1"
)

func GetUsernameFromToken(token string) (string, error) {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(cognitoRegion),
	}))
	cognitoClient := cognitoidentityprovider.New(sess)

	// トークンを検証するために AdminGetUser API を呼び出す
	input := &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(token),
	}
	result, err := cognitoClient.GetUser(input)
	if err != nil {
		return "", err
	}

	// ユーザー名を取得
	username := *result.Username
	return username, nil
}
