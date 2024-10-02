package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"example.com/hello-world/domain/cognito"
	"example.com/hello-world/util"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var s3Client *s3.Client

func CreateResponse(statusCode int, body, allowedOrigin string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  allowedOrigin,
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
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

// 初期化処理
func init() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	s3Client = s3.NewFromConfig(cfg)
}

// プリサインドURLを生成する関数
func generatePresignedPUTURL(fileName string) (string, error) {
	presignClient := s3.NewPresignClient(s3Client)

	req, err := presignClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(util.GetSetting().BucketName),
		Key:    aws.String(fileName),
	}, s3.WithPresignExpires(15*time.Minute)) // URLの有効期限は15分

	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}
	return req.URL, nil
}

func generatePresignedGETURL(fileName string) (string, error) {
	presignClient := s3.NewPresignClient(s3Client)

	req, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(util.GetSetting().BucketName),
		Key:    aws.String(fileName),
	}, s3.WithPresignExpires(15*time.Minute)) // URLの有効期限は15分

	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}
	return req.URL, nil
}

// Lambdaハンドラ
func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	allowOrigin := ConfirmAllowedOrigin(request.Headers["origin"])

	err := cognito.ConfirmUser(request.Headers["x-poster"], request.Headers["Authorization"])
	if err != nil {
		return CreateResponse(http.StatusUnauthorized, err.Error(), allowOrigin), nil
	}

	fileName := request.QueryStringParameters["filename"]
	if fileName == "" {
		return CreateResponse(http.StatusBadRequest, "Missing filename", allowOrigin), nil
	}

	switch request.Path {
	case "/files-upload":
		url, err := generatePresignedPUTURL(fileName)
		if err != nil {
			return CreateResponse(http.StatusInternalServerError, "Failed to generate presigned put URL", allowOrigin), nil
		}
		return CreateResponse(http.StatusOK, fmt.Sprintf(`{"url": "%s"}`, url), allowOrigin), nil

	case "/files-download":
		url, err := generatePresignedGETURL(fileName)
		if err != nil {
			return CreateResponse(http.StatusInternalServerError, "Failed to generate presigned get URL", allowOrigin), nil
		}
		return CreateResponse(http.StatusOK, fmt.Sprintf(`{"url": "%s"}`, url), allowOrigin), nil

	default:
		return CreateResponse(http.StatusBadRequest, "invalid request path", allowOrigin), nil
	}
}

func main() {
	lambda.Start(handler)
}
