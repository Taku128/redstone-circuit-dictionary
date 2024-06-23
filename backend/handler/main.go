package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

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
		return handleGet(svc)
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

func handleGet(svc *dynamodb.DynamoDB) (events.APIGatewayProxyResponse, error) {
	result, err := svc.Scan(&dynamodb.ScanInput{
		TableName: aws.String("dev-serverless-test"),
	})
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

func main() {
	lambda.Start(handler)
}
