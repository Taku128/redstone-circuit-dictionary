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
	"github.com/guregu/null"
)

type MessageRepo struct {
	TableName string
}

func NewMessageRepo() *MessageRepo {
	messageRepo := util.GetSetting().MessageTable
	return &MessageRepo{
		TableName: messageRepo.TableName,
	}
}

func (r *MessageRepo) List(communityID, messageCount null.Int, userName, postUserName string) (*[]Message, int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	var keyCond expression.KeyConditionBuilder
	if communityID.Valid {
		keyCond.And(expression.Key("community_id").GreaterThanEqual(expression.Value(communityID)))
	}
	if userName != "" {
		keyCond.And(expression.Key("user_name").GreaterThanEqual(expression.Value(userName)))
	}
	if messageCount.Valid {
		keyCond.And(expression.Key("message_count").GreaterThanEqual(expression.Value(messageCount)))
	}
	if postUserName != "" {
		keyCond.And(expression.Key("post_user_name").GreaterThanEqual(expression.Value(postUserName)))
	}
	expr, err := expression.NewBuilder().WithKeyCondition(keyCond).Build()
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to build expression: %w", err)
	}

	input := &dynamodb.QueryInput{
		TableName:                 aws.String(r.TableName),
		KeyConditionExpression:    expr.KeyCondition(),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
	}

	result, err := svc.Query(input)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to scan message: %w", err)
	}

	var messages []Message
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &messages)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to unmarshal message: %w", err)
	}
	return &messages, http.StatusOK, nil
}

func (r *MessageRepo) CreateOrUpdate(message *Message) (int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	update := expression.Set(expression.Name("message_count"), expression.Value(message.MessageCount))
	update.Set(expression.Name("content"), expression.Value(message.Content))
	update.Set(expression.Name("image_name"), expression.Value(message.ImageName))
	update.Set(expression.Name("post_user_name"), expression.Value(message.PostUserName))
	update.Set(expression.Name("created_at"), expression.Value(message.CreatedAt))

	expr, err := expression.NewBuilder().WithUpdate(update).Build()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to build expression: %w", err)
	}

	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(r.TableName),
		Key: map[string]*dynamodb.AttributeValue{
			"community_id": {
				N: aws.String(fmt.Sprintf("%d", message.CommunityID)),
			},
			"user_name": {
				S: aws.String(message.UserName),
			},
		},
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
	}

	_, err = svc.UpdateItem(input)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to create message: %w", err)
	}
	return http.StatusOK, nil
}
