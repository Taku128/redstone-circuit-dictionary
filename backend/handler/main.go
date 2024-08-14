package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func createResponse(statusCode int, body, allowedOrigin string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                     "application/json",
			"Access-Control-Allow-Origin":      allowedOrigin,
			"Access-Control-Allow-Credentials": "true",
		},
		Body: body,
	}
}

func getAllowedOrigin(requestOrigin string) string {
	allowedOrigins := []string{"http://localhost:3000", "https://staging.d1631t3ap8rd8k.amplifyapp.com/"}
	for _, origin := range allowedOrigins {
		if origin == requestOrigin {
			return origin
		}
	}
	return "null"
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	origin := request.Headers["origin"]
	allowedOrigin := getAllowedOrigin(origin)
	if request.HTTPMethod == http.MethodOptions {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Content-Type":                     "application/json",
				"Access-Control-Allow-Origin":      allowedOrigin,
				"Access-Control-Allow-Methods":     "GET, POST, DELETE, OPTIONS",
				"Access-Control-Allow-Headers":     "Content-Type, Authorization",
				"Access-Control-Allow-Credentials": "true",
			},
			Body: "message: Success",
		}, nil
	}

	var actionType string

	if request.Body != "" {
		bodyData := struct {
			ActionType string `json:"action_type"`
		}{}
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return createResponse(http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error(), allowedOrigin), nil
		}
		actionType = bodyData.ActionType
	}

	// GETはBodyがないのでQueryパラメータを使う
	if request.HTTPMethod == http.MethodGet || request.HTTPMethod == http.MethodDelete {
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
		return createResponse(http.StatusBadRequest, "Invalid action_type", allowedOrigin), nil
	}

}

func main() {
	lambda.Start(handler)
}
