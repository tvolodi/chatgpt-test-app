package tags

import (
	"encoding/json"
)

type Tag struct {
	ID   string          `json:"id"`
	Code string          `json:"code"`
	Name json.RawMessage `json:"name"`
}
