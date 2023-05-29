import {
  google, // The top level object used to access services
  youtube_v3, // For every service client, there is an exported namespace
} from "googleapis";
import { getMyListbyUserId, getWatchedVideobyUser } from "./db/hasura";
import { VideoDataForSection } from "./type/videoInfo";

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
//   const [videoList, seTVideoList] = useState<VideoInfo>();
export const searchYoutubeList = async (query: string) => {
  const service = google.youtube("v3");

  // Search.listメソッドの呼び出し
  const response = await service.search
    .list({
      maxResults: 10,
      q: query,
      part: ["snippet"],
      type: ["video"],
      key: apiKey,
    })
    .then((response) => {
      var results = response.data;

      if (response.status !== 200) {
        console.log("video fetch error", { response });
      }

      return results;
    })
    .catch((error: any) => {
      console.log(error);
      return null;
    })
    .finally();

  if (response) {
    const videoList = response?.items?.map((video) => {
      const videoData: VideoDataForSection = {
        videoId: video.id?.videoId!,
        imgUrl: video.snippet?.thumbnails?.high?.url ?? "/static/ゆきこ２.png",
        title: video.snippet?.title ?? "",
        description: video.snippet?.description ?? "",
        publishTime: video.snippet?.publishedAt ?? "",
        channelTitle: video.snippet?.channelTitle ?? "",
        statistics: "",
      };
      return videoData;
    });
    if (videoList) {
      return videoList;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

type Condition = {
  part: string[];
  maxResults: number;
  regionCode: string;
  key: string | undefined;
  chart?: string;
  id?: string[];
};

const defaultCondition: Condition = {
  part: ["snippet", "statistics"],
  maxResults: 10,
  regionCode: "jp",
  key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
};

export const searchYoutubeVideos = async (
  popularFlag: boolean,
  id?: string
) => {
  const service = google.youtube("v3");

  let searchCondition = { ...defaultCondition };
  if (popularFlag) {
    searchCondition.chart = "mostPopular";
  }
  if (id) {
    searchCondition.id = [id];
  }

  // Search.videosメソッドの呼び出し
  const response = await service.videos
    .list(searchCondition)
    .then((response) => {
      var results = response.data;

      if (response.status !== 200) {
        console.log("video fetch error", { response });
      }
      return results;
    })
    .catch((error: any) => {
      console.log(error);
      return null;
    })
    .finally();

  if (response) {
    const videoList = response?.items?.map((video) => {
      const videoData: VideoDataForSection = {
        videoId: video.id!,
        imgUrl: video.snippet?.thumbnails?.high?.url ?? "/static/ゆきこ２.png",
        title: video.snippet?.title ?? "",
        description: video.snippet?.description ?? "",
        publishTime: video.snippet?.publishedAt ?? "",
        channelTitle: video.snippet?.channelTitle ?? "",
        statistics: video.statistics?.viewCount ?? "",
      };
      return videoData;
    });
    if (videoList) {
      return videoList;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const getWatchedVideoFromHasura = async (
  token: string,
  userId: string
) => {
  const res = await getWatchedVideobyUser(token, userId);
  const watchedVideoList = res.map((video) => {
    const videoData: VideoDataForSection = {
      videoId: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
    return videoData;
  });
  return watchedVideoList;
};

export const getMyListFromHasura = async (token: string, userId: string) => {
  const res = await getMyListbyUserId(token, userId);
  const myList: VideoDataForSection[] = res.map((video) => {
    return {
      videoId: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
  return myList;
};
