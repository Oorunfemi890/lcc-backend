import axios from "axios";
import { logger } from "../logger/winston";

class YoutubeService {

    static async getLatestVideos(limit = 3) {
        try {
            // Step 1: Get the uploads playlist ID
            const channelResponse = await axios.get(`${process.env.YOUTUBE_BASE_URL}/channels`, {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    id: process.env.YOUTUBE_CHANNEL_ID,
                    part: "contentDetails"
                }
            });

            if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
                throw new Error('Channel not found. Check your channelId.');
            }

            const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

            // Step 2: Get videos from uploads playlist
            const playlistResponse = await axios.get(`${process.env.YOUTUBE_BASE_URL}/playlistItems`, {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    playlistId: uploadsPlaylistId,
                    part: "snippet,contentDetails",
                    maxResults: limit,
                    order: "date"
                }
            });


            return playlistResponse.data.items.map(item => ({
                videoId: item.contentDetails.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                publishedAt: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails.medium.url
            }));

        } catch (error) {
            logger.error(`Error getting last videos: ${error.message}`);
            throw error;
        }
    }


    static async getChannelInfo() {
        try {
            const response = await axios.get(`${process.env.YOUTUBE_BASE_URL}/channels`, {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    part: "snippet,contentDetails,statistics",
                    id: process.env.YOUTUBE_CHANNEL_ID
                }
            });
            return response.data.items[0];
        } catch (error) {
            logger.error(`Error fetching channel info: ${error.message}`);
            throw error;
        }
    }

}

export default YoutubeService;
