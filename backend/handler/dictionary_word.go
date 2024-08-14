package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"example.com/hello-world/domain/cognito"
	"example.com/hello-world/usecase"
	"example.com/hello-world/usecase/input"
	"github.com/aws/aws-lambda-go/events"
)

func dictionaryWord(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	origin := request.Headers["origin"]
	allowedOrigin := getAllowedOrigin(origin)
	var action, actionUser, cognitoSession string
	var dictionaryWord input.DictionaryWord

	if request.Body != "" {
		bodyData := struct {
			Action         string               `json:"action"`
			ActionUser     string               `json:"action_user"`
			CognitoSession string               `json:"cognito_session"`
			Data           input.DictionaryWord `json:"data"`
		}{}
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return createResponse(http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error(), allowedOrigin), nil
		}
		action = bodyData.Action
		actionUser = bodyData.ActionUser
		cognitoSession = bodyData.CognitoSession
		dictionaryWord = bodyData.Data
	}

	// GETはBodyがないのでQueryパラメータを使う
	if request.HTTPMethod == http.MethodGet || request.HTTPMethod == http.MethodDelete {
		result, ok := request.QueryStringParameters["action"]
		if !ok {
			action = ""
		} else {
			action = result
		}

	}

	if request.HTTPMethod == http.MethodDelete {
		result, ok := request.QueryStringParameters["poster"]
		if !ok {
			actionUser = ""
		} else {
			actionUser = result
		}
		result, ok = request.QueryStringParameters["cognito_session"]
		if !ok {
			cognitoSession = ""
		} else {
			cognitoSession = result
		}
	}

	// トークンを検証し、ユーザー情報を取得
	if request.HTTPMethod == http.MethodPost || request.HTTPMethod == http.MethodDelete {
		if cognitoSession == "" {
			return createResponse(http.StatusUnauthorized, string("Unauthorized"), allowedOrigin), nil
		}
		username, err := cognito.GetUsernameFromToken(cognitoSession)
		log.Printf("GetUsernameFromToken: %s", username)
		if err != nil || username != actionUser {
			return createResponse(http.StatusUnauthorized, string("Unauthorized"), allowedOrigin), nil
		}
	}

	switch request.HTTPMethod {
	case http.MethodGet:
		switch action {
		case "get_dictionary_word":
			word, ok := request.QueryStringParameters["word"]
			if !ok {
				word = ""
			}
			getDictionaryWord, statusCode, err := usecase.GetDictionaryWord(ctx, word)
			if err != nil {
				return createResponse(statusCode, err.Error(), allowedOrigin), err
			}
			response, err := json.Marshal(getDictionaryWord)
			if err != nil {
				return createResponse(http.StatusBadRequest, fmt.Errorf("failed to marshal dictionary word: %v", err).Error(), allowedOrigin), err
			}
			return createResponse(statusCode, string(response), allowedOrigin), err
		case "get_poster_dictionary_word":
			poster, ok := request.QueryStringParameters["poster"]
			if !ok {
				poster = ""
			}
			from, ok := request.QueryStringParameters["from"]
			if !ok {
				from = ""
			}
			to, ok := request.QueryStringParameters["to"]
			if !ok {
				to = ""
			}
			getDictionaryWord, statusCode, err := usecase.GetPosterDictionaryWord(ctx, poster, from, to)
			if err != nil {
				return createResponse(statusCode, err.Error(), allowedOrigin), nil
			}
			response, err := json.Marshal(getDictionaryWord)
			if err != nil {
				return createResponse(http.StatusBadRequest, fmt.Errorf("failed to marshal dictionary word: %v", err).Error(), allowedOrigin), err
			}
			return createResponse(statusCode, string(response), allowedOrigin), err
		default:
			return createResponse(http.StatusBadRequest, "Invalid get action", allowedOrigin), nil
		}
	case http.MethodPost:
		switch action {
		case "create_dictionary_word":
			statusCode, err := usecase.CreateDictionaryWord(ctx, dictionaryWord)
			if err != nil {
				return createResponse(statusCode, err.Error(), allowedOrigin), nil
			}
			return createResponse(statusCode, "Data created successfully", allowedOrigin), nil

		default:
			return createResponse(http.StatusBadRequest, "Invalid post action", allowedOrigin), nil
		}
	case http.MethodDelete:
		switch action {
		case "delete_dictionary_word":
			id, ok := request.QueryStringParameters["id"]
			if !ok {
				id = ""
			}
			statusCode, err := usecase.DeleteDictionaryWord(ctx, id)
			if err != nil {
				return createResponse(statusCode, err.Error(), allowedOrigin), nil
			}
			return createResponse(statusCode, "Data delete successfully", allowedOrigin), nil
		default:
			return createResponse(http.StatusBadRequest, "Invalid delete action", allowedOrigin), nil
		}
	default:
		return createResponse(http.StatusBadRequest, "Invalid action", allowedOrigin), nil
	}
}
