package db

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func DictionaryWordTableName() (string, error) {
	err := godotenv.Load()
	if err != nil {
		return "", err
	}
	tableName := os.Getenv("DICTIONARYWORD_TABLE")
	return tableName, nil
}

// DictionaryWordを全件取得する
func List() (*[]DictionaryWord, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	tableName, err := DictionaryWordTableName()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}
	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
	}
	result, err := svc.Scan(input)
	if err != nil {
		return nil, fmt.Errorf("failed to scan table: %w", err)
	}

	var dictionaryWords []DictionaryWord
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &dictionaryWords)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal dictionary_words: %w", err)
	}
	return &dictionaryWords, nil
}

// 指定したwordを含むDictionaryWordを取得する
func SearchByContainedWord(word string) (*[]DictionaryWord, error) {
	var filterExpression string
	var expressionAttributeValues map[string]*dynamodb.AttributeValue

	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	if word != "" {
		filterExpression = "contains(word, :w)"
		expressionAttributeValues = map[string]*dynamodb.AttributeValue{
			":w": {
				S: aws.String(word),
			},
		}
	}

	tableName, err := DictionaryWordTableName()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %w", err)
	}
	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
	}

	if filterExpression != "" {
		input.FilterExpression = aws.String(filterExpression)
		input.ExpressionAttributeValues = expressionAttributeValues
	}

	result, err := svc.Scan(input)
	if err != nil {
		return nil, fmt.Errorf("failed to scan table: %w", err)
	}

	var dictionaryWords []DictionaryWord
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &dictionaryWords)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal dictionary_words: %w", err)
	}
	return &dictionaryWords, nil
}

// DictionaryWordの項目を作成
func Create(dictionaryWord DictionaryWord) error {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	update := expression.Set(expression.Name("word"), expression.Value(dictionaryWord.Word))
	update.Set(expression.Name("description"), expression.Value(dictionaryWord.Description))
	update.Set(expression.Name("category"), expression.Value(dictionaryWord.Category))
	update.Set(expression.Name("video"), expression.Value(dictionaryWord.Video))

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		return fmt.Errorf("couldn't build expression for update. Here's why: %w", err)
	}

	tableName, err := DictionaryWordTableName()
	if err != nil {
		return fmt.Errorf("error loading .env file: %w", err)
	}
	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"Number": {
				N: aws.String(fmt.Sprintf("%d", dictionaryWord.Number)),
			},
		},
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
	}

	_, err = svc.UpdateItem(input)
	if err != nil {
		return fmt.Errorf("failed to create dictionary_words in DynamoDB: %w", err)
	}
	return nil
}
