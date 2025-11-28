import axios from "axios";

class YoutubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.channelId = process.env.YOUTUBE_CHANNEL_ID;
        this.baseUrl = "https://www.googleapis.com/youtube/v3";
    }

    async getLatestVideos(limit = 3) {
        try {
            const response = await axios.get(`${this.baseUrl}/search`, {
                params: {
                    key: this.apiKey,
                    channelId: this.channelId,
                    part: "snippet,id",
                    order: "date",
                    maxResults: limit,
                    type: "video"
                }
            });

            return response.data.items;
        } catch (error) {
            console.error("Error fetching YouTube videos:", error?.response?.data || error.message);
            throw error;
        }
    }
}

export default YoutubeService;
