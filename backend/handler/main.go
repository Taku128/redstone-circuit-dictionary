package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/hello-world/usecase"
	"example.com/hello-world/usecase/input"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func CreateResponse(statusCode int, body string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*", // CORS header
		},
		Body: body,
	}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod == "OPTIONS" {
		// Preflight request
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

	var dictionaryWord input.NotNumberDictionaryWord
	if request.Body != "" {
		err := json.Unmarshal([]byte(request.Body), &dictionaryWord)
		if err != nil {
			return CreateResponse(http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error()), nil
		}
	}

	switch request.HTTPMethod {
	case "GET":
		word, ok := request.QueryStringParameters["word"]
		if !ok {
			word = ""
		}
		getDictionaryWord, statusCode, err := usecase.GetDictionaryWord(ctx, word)
		if err != nil {
			return CreateResponse(statusCode, err.Error()), err
		}
		response, err := json.Marshal(getDictionaryWord)
		if err != nil {
			return CreateResponse(http.StatusBadRequest, fmt.Errorf("failed to marshal dictionary word: %v", err).Error()), err
		}
		return CreateResponse(statusCode, string(response)), err

	case "POST":
		statusCode, err := usecase.CreateDictionaryWord(ctx, dictionaryWord)
		if err != nil {
			return CreateResponse(statusCode, err.Error()), nil
		}
		return CreateResponse(statusCode, "Data created successfully"), nil

	default:
		return CreateResponse(http.StatusMethodNotAllowed, "Method Not Allowed"), nil
	}
}

func main() {
	lambda.Start(handler)
}
