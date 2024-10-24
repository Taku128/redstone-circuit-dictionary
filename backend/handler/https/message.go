package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/hello-world/usecase"
	"example.com/hello-world/usecase/input"
	"example.com/hello-world/util"
	"github.com/aws/aws-lambda-go/events"
)

type BodyMessage struct {
	Message input.Message `json:"message"`
}

func (h HeaderConfig) Message(ctx context.Context, request events.APIGatewayProxyRequest) (int, string, error) {
	var bodyData BodyMessage

	if request.Body != "" {
		err := json.Unmarshal([]byte(request.Body), &bodyData)
		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("bad request: %v", err).Error(), nil
		}
	}

	switch {
	case request.HTTPMethod == http.MethodGet && h.ProcessingType2 == "get_message":
		communityID := util.StringToNullInt(request.QueryStringParameters["community_id"])
		messageCount := util.StringToNullInt(request.QueryStringParameters["message_count"])
		userName := request.QueryStringParameters["user_name"]
		postUserName := request.QueryStringParameters["post_user_name"]
		community, statusCode, err := usecase.GetMessage(ctx, communityID, messageCount, userName, postUserName)
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
