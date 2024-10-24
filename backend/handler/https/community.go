package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/hello-world/usecase"
	"example.com/hello-world/usecase/input"
	"github.com/aws/aws-lambda-go/events"
)

type BodyCommunity struct {
	DictionaryWord input.Community `json:"community"`
}

func (h HeaderConfig) Community(ctx context.Context, request events.APIGatewayProxyRequest) (int, string, error) {
	var bodyData BodyCommunity

	if request.Body != "" {
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error(), nil
		}
	}

	switch {
	case request.HTTPMethod == http.MethodGet && h.ProcessingType2 == "get_community":
		edition := request.QueryStringParameters["edition"]
		community, statusCode, err := usecase.GetCommunity(ctx, edition)
		if err != nil {
			return statusCode, err.Error(), err
		}
		response, err := json.Marshal(community)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to marshal community: %v", err).Error(), err
		}
		return statusCode, string(response), nil

	default:
		return http.StatusBadRequest, "invalid processing type2", nil
	}
}
