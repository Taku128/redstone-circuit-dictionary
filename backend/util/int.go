package util

import (
	"strconv"

	"github.com/guregu/null"
)

func StringToNullInt(s string) null.Int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return null.Int{}
	}
	return null.IntFrom(int64(i))
}
