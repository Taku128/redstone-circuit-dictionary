package db

import (
	"fmt"
	"net/http"

	"example.com/hello-world/util"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
)

type DictionaryWordRepo struct {
	TableName   string
	PosterIndex string
}

func NewDictionaryWordRepo() *DictionaryWordRepo {
	dictionaryWordRepo := util.GetSetting().DictionaryWordTable
	return &DictionaryWordRepo{
		TableName:   dictionaryWordRepo.TableName,
		PosterIndex: dictionaryWordRepo.PosterIndex,
	}
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
		Limit:     aws.Int64(30),
	}

	if filterExpression != "" {
		input.FilterExpression = aws.String(filterExpression)
		input.ExpressionAttributeValues = expressionAttributeValues
	}

	result, err := svc.Scan(input)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to scan dictionary word: %w", err)
	}

	var dictionaryWords []DictionaryWord
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &dictionaryWords)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to unmarshal dictionary word: %w", err)
	}
	return &dictionaryWords, http.StatusOK, nil
}

// poster、投稿日時を指定したDictionaryWordを取得する
func (r *DictionaryWordRepo) SearchByPoster(poster, from, to string) (*[]DictionaryWord, int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	keyCond := expression.Key("poster").Equal(expression.Value(poster))
	if from != "" {
		keyCond.And(expression.Key("created_at").GreaterThanEqual(expression.Value(from)))
	}
	if to != "" {
		keyCond.And(expression.Key("created_at").LessThanEqual(expression.Value(to)))
	}

	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to build expression: %w", err)
	}

	input := &dynamodb.QueryInput{
		TableName:                 aws.String(r.TableName),
		Limit:                     aws.Int64(30),
		IndexName:                 aws.String(r.PosterIndex),
		KeyConditionExpression:    expr.KeyCondition(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
	}

	result, err := svc.Query(input)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to query dictionary word: %w", err)
	}

	var dictionaryWords []DictionaryWord
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &dictionaryWords)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to unmarshal dictionary word: %w", err)
	}
	return &dictionaryWords, http.StatusOK, nil
}

// DictionaryWordの項目を作成、編集
func (r *DictionaryWordRepo) CreateOrUpdate(dictionaryWord *DictionaryWord) (int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	update := expression.Set(expression.Name("word"), expression.Value(dictionaryWord.Word))
	update.Set(expression.Name("description"), expression.Value(dictionaryWord.Description))
	update.Set(expression.Name("category_json"), expression.Value(dictionaryWord.CategoryJson))
	update.Set(expression.Name("video_json"), expression.Value(dictionaryWord.VideoJson))
	update.Set(expression.Name("poster"), expression.Value(dictionaryWord.Poster))
	update.Set(expression.Name("created_at"), expression.Value(dictionaryWord.CreatedAt))

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to build expression: %w", err)
	}

	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(r.TableName),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				N: aws.String(fmt.Sprintf("%d", dictionaryWord.ID)),
			},
		},
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
	}

	_, err = svc.UpdateItem(input)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to create dictionary word: %w", err)
	}
	return http.StatusOK, nil
}

func (r *DictionaryWordRepo) Delete(id int) (int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	input := &dynamodb.DeleteItemInput{
		TableName: aws.String(r.TableName),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				N: aws.String(fmt.Sprintf("%d", id)),
			},
		},
	}

	_, err := svc.DeleteItem(input)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to delete dictionary word: %w", err)
	}

	return http.StatusOK, nil
}
