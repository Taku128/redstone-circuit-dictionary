package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/hello-world/usecase"
	"example.com/hello-world/usecase/input"
	"github.com/aws/aws-lambda-go/events"
)

func dictionaryWord(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var action string
	var dictionaryWord input.DictionaryWord

	if request.Body != "" {
		bodyData := struct {
			Action string               `json:"action"`
			Data   input.DictionaryWord `json:"data"`
		}{}
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return createResponse(http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error()), nil
		}
		action = bodyData.Action
		dictionaryWord = bodyData.Data
	}

	// GETはBodyがないのでQueryパラメータを使う
	if request.HTTPMethod == http.MethodGet {
		result, ok := request.QueryStringParameters["action"]
		if !ok {
			action = ""
		} else {
			action = result
		}
	}

	switch action {
	case "get_dictionary_word":
		word, ok := request.QueryStringParameters["word"]
		if !ok {
			word = ""
		}
		getDictionaryWord, statusCode, err := usecase.GetDictionaryWord(ctx, word)
		if err != nil {
			return createResponse(statusCode, err.Error()), err
		}
		response, err := json.Marshal(getDictionaryWord)
		if err != nil {
			return createResponse(http.StatusBadRequest, fmt.Errorf("failed to marshal dictionary word: %v", err).Error()), err
		}
		return createResponse(statusCode, string(response)), err

	case "create_dictionary_word":
		statusCode, err := usecase.CreateDictionaryWord(ctx, dictionaryWord)
		if err != nil {
			return createResponse(statusCode, err.Error()), nil
		}
		return createResponse(statusCode, "Data created successfully"), nil

	default:
		return createResponse(http.StatusBadRequest, "Invalid action"), nil
	}
}
