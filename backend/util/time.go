package util

import (
	"fmt"
	"net/http"
	"time"
)

// 現在時刻を入手
func TimeNow() (time.Time, int, error) {
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		return time.Time{}, http.StatusInternalServerError, fmt.Errorf("failed to load location: %w", err)
	}
	t := time.Now().In(loc)
	return t, http.StatusOK, nil
}
