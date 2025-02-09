const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const channelId = 'UCVTncBq3aTBi-RMY5TkTDjQ';
const uploadId = 'UUVTncBq3aTBi-RMY5TkTDjQ';

const video = {}

video.fetch = async (uploadsPlaylistId) => {
    const url = 'https://www.googleapis.com/youtube/v3/playlistItems';
    let videos = [];
    let nextPageToken = undefined;
    try {
      do {
        const params = {
          part: 'snippet',
          playlistId: uploadId,
          maxResults: 50,  // maximum allowed per request
          key: process.env.YOUTUBE
        };
        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }
        const response = await axios.get(url, { params });
        const items = response.data.items;
        items.forEach(item => {
          // Each item’s snippet.resourceId.videoId contains the video reference.
          if (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId) {
            videos.push({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                publishedAt: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails.maxres.url
            });
          }
        });
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
    } catch (error) {
      console.error("Error fetching playlist items:", error);
      process.exit(1);
    }
    console.log(`Fetched ${videos.length} videos using Youtube API`);
    fs.writeFileSync('./content/videos.json', JSON.stringify(videos), 'utf8');
    return videos;
}

module.exports = video;
