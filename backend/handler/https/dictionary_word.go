package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"example.com/hello-world/domain/cognito"
	"example.com/hello-world/usecase"
	"example.com/hello-world/usecase/input"
	"github.com/aws/aws-lambda-go/events"
)

type BodyDictionaryWord struct {
	ActionUser     string               `json:"action_user"`
	CognitoSession string               `json:"cognito_session"`
	DictionaryWord input.DictionaryWord `json:"dictionary_word"`
}

func (h HeaderConfig) DictionaryWord(ctx context.Context, request events.APIGatewayProxyRequest) (int, string, error) {
	var bodyData BodyDictionaryWord

	if request.Body != "" {
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error(), nil
		}
	}

	switch {
	case request.HTTPMethod == http.MethodGet && h.ProcessingType2 == "get_dictionary_word":
		word := request.QueryStringParameters["word"]
		getDictionaryWord, statusCode, err := usecase.GetDictionaryWord(ctx, word)
		if err != nil {
			return statusCode, err.Error(), err
		}
		response, err := json.Marshal(getDictionaryWord)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to marshal dictionary word: %v", err).Error(), err
		}
		return statusCode, string(response), nil

	case request.HTTPMethod == http.MethodGet && h.ProcessingType2 == "get_poster_dictionary_word":
		poster := request.QueryStringParameters["poster"]
		from := request.QueryStringParameters["from"]
		to := request.QueryStringParameters["to"]
		getDictionaryWord, statusCode, err := usecase.GetPosterDictionaryWord(ctx, poster, from, to)
		if err != nil {
			return statusCode, err.Error(), nil
		}
		response, err := json.Marshal(getDictionaryWord)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to marshal dictionary word: %v", err).Error(), err
		}
		return statusCode, string(response), err

	case request.HTTPMethod == http.MethodPost && h.ProcessingType2 == "create_dictionary_word":
		err := cognito.ConfirmUser(bodyData.DictionaryWord.Poster, bodyData.CognitoSession)
		if err != nil {
			return http.StatusUnauthorized, err.Error(), nil
		}
		statusCode, err := usecase.CreateDictionaryWord(ctx, bodyData.DictionaryWord)
		if err != nil {
			return statusCode, err.Error(), nil
		}
		return statusCode, "data create successfully", nil

	case request.HTTPMethod == http.MethodPut && h.ProcessingType2 == "update_dictionary_word":
		err := cognito.ConfirmUser(bodyData.DictionaryWord.Poster, bodyData.CognitoSession)
		if err != nil {
			return http.StatusUnauthorized, err.Error(), nil
		}
		idStr, ok := request.PathParameters["id"]
		if !ok {
			return http.StatusBadRequest, fmt.Errorf("failed to get id").Error(), nil
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to marshal id").Error(), nil
		}
		statusCode, err := usecase.UpdateDictionaryWord(ctx, bodyData.DictionaryWord, id)
		if err != nil {
			return statusCode, err.Error(), nil
		}
		return statusCode, "data update successfully", nil

	case request.HTTPMethod == http.MethodDelete && h.ProcessingType2 == "delete_dictionary_word":
		err := cognito.ConfirmUser(bodyData.DictionaryWord.Poster, bodyData.CognitoSession)
		if err != nil {
			return http.StatusUnauthorized, err.Error(), nil
		}
		idStr, ok := request.PathParameters["id"]
		if !ok {
			return http.StatusBadRequest, fmt.Errorf("failed to get id").Error(), nil
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to marshal id").Error(), nil
		}
		statusCode, err := usecase.DeleteDictionaryWord(ctx, id)
		if err != nil {
			return statusCode, err.Error(), nil
		}
		return statusCode, "data delete successfully", nil

	default:
		return http.StatusBadRequest, "invalid processing type2", nil
	}
}
