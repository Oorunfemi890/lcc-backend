import YoutubeService from "../service/youtube.service";

class YoutubeHelper {
    static async getLatestVideos(limit = 3) {
        try {
            const youtubeService = new YoutubeService();
            return await youtubeService.getLatestVideos(limit);
        } catch (error) {
            console.error("YoutubeHelper Error:", error.message);
            throw error;
        }
    }
}

export default YoutubeHelper;
