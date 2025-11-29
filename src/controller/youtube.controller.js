import YoutubeService from "../service/youtube.service";

class YoutubeController {
    static async getLatestVideos(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            const videos = await YoutubeService.getLatestVideos(limit);

            return res.status(200).send({
                message: "Videos fetched successfully",
                data: videos
            });
        } catch (error) {
            console.error("Error fetching videos:", error.message);
            return res.status(500).send({ message: "Internal server error" });
        }
    }


    static async getChannelInfo(req, res) {
        try {
            const channel = await YoutubeService.getChannelInfo();
            return res.status(200).send({
                message: "Channel info fetched successfully",
                data: channel
            });
        } catch (error) {
            console.error("Error fetching channel info:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }
}

export default YoutubeController;
