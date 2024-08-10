package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func createResponse(statusCode int, body string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: body,
	}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Content-Type":                 "application/json",
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
			Body: "",
		}, nil
	}

	var actionType string

	if request.Body != "" {
		bodyData := struct {
			ActionType string `json:"action_type"`
		}{}
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return createResponse(http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error()), nil
		}
		actionType = bodyData.ActionType
	}

	// GETはBodyがないのでQueryパラメータを使う
	if request.HTTPMethod == http.MethodGet {
		result, ok := request.QueryStringParameters["action_type"]
		if !ok {
			actionType = ""
		} else {
			actionType = result
		}
	}

	switch actionType {
	case "dictionary_word":
		return dictionaryWord(ctx, request)

	default:
		return createResponse(http.StatusBadRequest, "Invalid action_type"), nil
	}

}

func main() {
	lambda.Start(handler)
}
