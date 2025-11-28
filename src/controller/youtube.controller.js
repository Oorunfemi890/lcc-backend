import YoutubeHelper from "../helpers/youtube.helper";

class YoutubeController {
    static async getLatestVideos(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            const videos = await YoutubeHelper.getLatestVideos(limit);

            return res.status(200).send({
                message: "Videos fetched successfully",
                data: videos
            });
        } catch (error) {
            console.error("Error fetching videos:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }
}

export default YoutubeController;
