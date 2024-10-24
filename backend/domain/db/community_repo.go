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

type CommunityRepo struct {
	TableName string
}

func NewCommunityRepo() *CommunityRepo {
	communityRepo := util.GetSetting().CommunityTable
	return &CommunityRepo{
		TableName: communityRepo.TableName,
	}
}

func (r *CommunityRepo) List(edition string) (*[]Community, int, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	filter := expression.Name("edition").Equal(expression.Value(edition))
	expr, err := expression.NewBuilder().WithFilter(filter).Build()
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to build expression: %w", err)
	}

	input := &dynamodb.ScanInput{
		TableName:                 aws.String(r.TableName),
		Limit:                     aws.Int64(30),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
	}

	result, err := svc.Scan(input)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to scan community: %w", err)
	}

	var cummunities []Community
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &cummunities)
	if err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("failed to unmarshal community: %w", err)
	}
	return &cummunities, http.StatusOK, nil
}
