package input

type Message struct {
	CommunityID  int    `json:"community_id"`
	UserName     string `json:"user_name"`
	MessageCount int    `json:"message_count"`
	Content      string `json:"content"`
	ImageName    string `json:"image_name"`
	PostUserName string `json:"post_user_name"`
	CreatedAt    string `json:"created_at"`
}
