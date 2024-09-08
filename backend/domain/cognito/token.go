package cognito

import (
	"fmt"

	"example.com/hello-world/util"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

// トークンからユーザー名を取得
func GetUsernameFromToken(token string) (string, error) {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(util.GetSetting().AWSRegion),
	}))
	cognitoClient := cognitoidentityprovider.New(sess)

	// トークンを検証するためにAdminGetUserAPIを呼び出す
	input := &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(token),
	}
	result, err := cognitoClient.GetUser(input)
	if err != nil {
		return "", err
	}
	return *result.Username, nil
}

func ConfirmUser(actionUser string, cognitoSession string) error {
	userName, err := GetUsernameFromToken(cognitoSession)
	if err != nil {
		return fmt.Errorf("faild to get username from session: %v", err)
	}
	if userName != actionUser || actionUser == "" {
		return fmt.Errorf("unauthorized: %v", err)
	}
	return nil
}
