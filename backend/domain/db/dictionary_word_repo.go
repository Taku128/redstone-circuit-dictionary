package db

import (
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

type DictionaryWordRepo struct {
	TableName string
}

func NewDictionaryWordRepo() (*DictionaryWordRepo, int, error) {
	return &DictionaryWordRepo{
		TableName: "dev-serverless-test",
	}, http.StatusOK, nil
}

// 指定したwordを含むDictionaryWordを取得する(指定しなければ全件取得)
func (r *DictionaryWordRepo) List(word string) (*[]DictionaryWord, int, error) {
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

	input := &dynamodb.ScanInput{
		TableName: aws.String(r.TableName),
	}

	if filterExpression != "" {
		input.FilterExpression = aws.String(filterExpression)
		input.ExpressionAttributeValues = expressionAttributeValues
	}

	result, err := svc.Scan(input)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to scan table: %w", err)
	}

	var dictionaryWords []DictionaryWord
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &dictionaryWords)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to unmarshal dictionary_words: %w", err)
	}
	return &dictionaryWords, http.StatusOK, nil
}

// DictionaryWordの項目を作成、編集
func (r *DictionaryWordRepo) CreateOrUpdate(dictionaryWord DictionaryWord) (int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	update := expression.Set(expression.Name("word"), expression.Value(dictionaryWord.Word))
	update.Set(expression.Name("description"), expression.Value(dictionaryWord.Description))
	update.Set(expression.Name("category"), expression.Value(dictionaryWord.Category))
	update.Set(expression.Name("video"), expression.Value(dictionaryWord.Video))
	update.Set(expression.Name("poster"), expression.Value(dictionaryWord.Poster))
	update.Set(expression.Name("created_at"), expression.Value(dictionaryWord.CreatedAt))

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't build expression for update. Here's why: %w", err)
	}

	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(r.TableName),
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
		return http.StatusInternalServerError, fmt.Errorf("failed to create dictionary_words in DynamoDB: %w", err)
	}
	return http.StatusOK, nil
}
