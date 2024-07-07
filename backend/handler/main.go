package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/url"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/google/uuid"
)

type DictionaryItem struct {
	Word        string `json:"word"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Video       string `json:"video"`
}

type GetDictionaryItem struct {
	Number      int    `json:"Number"`
	Word        string `json:"word"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Video       string `json:"video"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Initialize the DynamoDB session
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	// Determine HTTP method
	switch request.HTTPMethod {
	case "GET":
		return handleGet(svc, request.QueryStringParameters)
	case "POST":
		return handleUpdate(svc, request)
	default:
		return events.APIGatewayProxyResponse{
			StatusCode: 405,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
			},
			Body: "Method Not Allowed",
		}, nil
	}
}

func handleGet(svc *dynamodb.DynamoDB, queryParams map[string]string) (events.APIGatewayProxyResponse, error) {
	var filterExpression string
	var expressionAttributeValues map[string]*dynamodb.AttributeValue

	if word, ok := queryParams["word"]; ok && word != "" {
		filterExpression = "contains(word, :w)"
		expressionAttributeValues = map[string]*dynamodb.AttributeValue{
			":w": {
				S: aws.String(word),
			},
		}
	}

	input := &dynamodb.ScanInput{
		TableName: aws.String("dev-serverless-test"),
	}

	// If a filter expression is set, add it to the input
	if filterExpression != "" {
		input.FilterExpression = aws.String(filterExpression)
		input.ExpressionAttributeValues = expressionAttributeValues
	}

	result, err := svc.Scan(input)
	if err != nil {
		log.Fatalf("Failed to scan table: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
			},
			Body: "Internal Server Error",
		}, nil
	}

	var items []GetDictionaryItem
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &items)
	if err != nil {
		log.Fatalf("Failed to unmarshal records: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
			},
			Body: "Internal Server Error",
		}, nil
	}

	response, err := json.Marshal(items)
	if err != nil {
		log.Fatalf("Failed to marshal items: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
			},
			Body: "Internal Server Error",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
		},
		Body: string(response),
	}, nil
}

func handleUpdate(svc *dynamodb.DynamoDB, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var item DictionaryItem
	err := json.Unmarshal([]byte(request.Body), &item)
	if err != nil {
		log.Fatalf("Failed to unmarshal request body: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
			},
			Body: "Bad Request",
		}, nil
	}

	var urls []string
	if item.Video != "[]" {
		err = json.Unmarshal([]byte(item.Video), &urls)
		if err != nil {
			fmt.Println("Error parsing JSON:", err)
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Headers: map[string]string{
					"Content-Type":                "application/json",
					"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
				},
				Body: fmt.Sprint("Error parsing JSON:", err),
			}, nil
		}

		embedURLs, err := validateAndConvertURLs(urls)
		if err != nil {
			fmt.Println("Error:", err)
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Headers: map[string]string{
					"Content-Type":                "application/json",
					"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
				},
				Body: fmt.Sprint("Error:", err),
			}, nil
		}

		result, err := json.Marshal(embedURLs)
		if err != nil {
			fmt.Println("Error converting to JSON:", err)
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Headers: map[string]string{
					"Content-Type":                "application/json",
					"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
				},
				Body: fmt.Sprint("Error converting to JSON:", err),
			}, nil
		}

		item.Video = string(result)
	}

	// Generate a UUID for the number field
	Number := int(uuid.New().ID())

	// Create the update expression and attribute values
	updateExpression := "SET word = :w, description = :d, category = :c, video = :v"
	expressionAttributeValues := map[string]*dynamodb.AttributeValue{
		":w": {
			S: aws.String(item.Word),
		},
		":d": {
			S: aws.String(item.Description),
		},
		":c": {
			S: aws.String(item.Category),
		},
		":v": {
			S: aws.String(item.Video),
		},
	}

	// Create the update input parameters
	input := &dynamodb.UpdateItemInput{
		TableName: aws.String("dev-serverless-test"),
		Key: map[string]*dynamodb.AttributeValue{
			"Number": {
				N: aws.String(fmt.Sprintf("%d", Number)),
			},
		},
		UpdateExpression:          aws.String(updateExpression),
		ExpressionAttributeValues: expressionAttributeValues,
		ReturnValues:              aws.String("UPDATED_NEW"),
	}

	_, err = svc.UpdateItem(input)
	if err != nil {
		log.Fatalf("Failed to create item in DynamoDB: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
			},
			Body: "Internal Server Error",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*", // CORS ヘッダーを追加
		},
		Body: "Data created successfully",
	}, nil
}

func validateAndConvertURLs(urls []string) ([]string, error) {
	var result []string

	for _, v := range urls {
		u, err := url.Parse(v)
		if err != nil || (u.Host != "www.youtube.com" && u.Host != "youtu.be") {
			return nil, errors.New("Invalid URL: " + v)
		}

		// Check if it's already an embed URL
		if strings.Contains(u.Path, "embed") {
			result = append(result, v)
			continue
		}

		// Extract the video ID and construct the embed URL
		var videoID string
		if u.Host == "www.youtube.com" {
			queryParams := u.Query()
			videoID = queryParams.Get("v")
			if videoID == "" {
				return nil, errors.New("Invalid YouTube URL: " + v)
			}
		} else if u.Host == "youtu.be" {
			videoID = strings.TrimPrefix(u.Path, "/")
		}

		embedURL := "https://www.youtube.com/embed/" + videoID
		result = append(result, embedURL)
	}

	return result, nil
}

func main() {
	lambda.Start(handler)
}
