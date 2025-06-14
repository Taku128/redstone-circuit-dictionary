package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
)

type CognitoEvent struct {
	Version       string `json:"version"`
	TriggerSource string `json:"triggerSource"`
	Region        string `json:"region"`
	UserPoolID    string `json:"userPoolId"`
	UserName      string `json:"userName"`
	Request       struct {
		UserAttributes map[string]string `json:"userAttributes"`
	} `json:"request"`
	Response struct {
		AutoConfirmUser bool `json:"autoConfirmUser"`
	} `json:"response"`
}

func handler(ctx context.Context, event CognitoEvent) (CognitoEvent, error) {
	// サインアップに成功したユーザを自動承認する
	if event.TriggerSource == "PreSignUp_SignUp" {
		event.Response.AutoConfirmUser = true
	}
	return event, nil
}

func main() {
	lambda.Start(handler)
}
