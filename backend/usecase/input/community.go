package input

type Community struct {
	ID            int    `json:"id"`
	Edition       string `json:"edition"`
	Title         string `json:"title"`
	Content       string `json:"content"`
	ImageName     string `json:"image_name"`
	LatestVersion string `json:"latest_version"`
	OldestVersion string `json:"oldest_version"`
}
