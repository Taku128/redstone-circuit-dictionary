package main

import (
	"context"
	"log"
	"net/http"

	"example.com/hello-world/util"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type HeaderConfig struct {
	AllowedOrigin   string
	ProcessingType1 string
	ProcessingType2 string
}

func (h HeaderConfig) CreateResponse(statusCode int, body string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                     "application/json",
			"Access-Control-Allow-Origin":      h.AllowedOrigin,
			"Access-Control-Allow-Methods":     "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers":     "Content-Type, Authorization",
			"Access-Control-Allow-Credentials": "true",
			"x-processing-type1":               h.ProcessingType1,
			"x-processing-type2":               h.ProcessingType2,
		},
		Body: body,
	}
}

// アクセス元のオリジンが許可されているか確認する
func ConfirmAllowedOrigin(requestOrigin string) string {
	allowedOrigins := util.GetSetting().AllowedOrigins
	for _, allowedOrigin := range allowedOrigins {
		if allowedOrigin == requestOrigin {
			return requestOrigin
		}
	}
	return ""
}

func (h *HeaderConfig) HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (int, string, error) {
	// オリジンの確認
	h.AllowedOrigin = ConfirmAllowedOrigin(request.Headers["origin"])
	if h.AllowedOrigin == "" {
		return http.StatusUnauthorized, "origin not allowed", nil
	}

	// プリフライトリクエストの処理
	if request.HTTPMethod == http.MethodOptions {
		return http.StatusOK, "OK", nil
	}

	h.ProcessingType1 = request.Headers["x-processing-type1"]
	h.ProcessingType2 = request.Headers["x-processing-type2"]
	switch h.ProcessingType1 {
	case "dictionary_word":
		return h.DictionaryWord(ctx, request)
	case "community":
		return h.Community(ctx, request)
	case "message":
		return h.Message(ctx, request)

	default:
		return http.StatusBadRequest, "invalid processing type1", nil
	}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	headerConfig := HeaderConfig{}
	statusCode, body, err := headerConfig.HandleRequest(ctx, request)
	log.Printf("x-processing-type1 = %s,\tx-processing-type2 = %s", headerConfig.ProcessingType1, headerConfig.ProcessingType2)
	if err != nil {
		log.Printf("error :=%s", err.Error())
	}
	return headerConfig.CreateResponse(statusCode, body), err
}

func main() {
	lambda.Start(handler)
}
