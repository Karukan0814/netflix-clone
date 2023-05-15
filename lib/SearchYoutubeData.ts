import {
  google, // The top level object used to access services
  youtube_v3, // For every service client, there is an exported namespace
} from "googleapis";

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

  return response;
};

export const searchPopularVideos = async () => {
  const service = google.youtube("v3");

  // Search.listメソッドの呼び出し
  const response = await service.videos
    .list({
      part: ["snippet"],
      chart: "mostPopular",
      maxResults: 10,
      regionCode: "jp",
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

  return response;
};
