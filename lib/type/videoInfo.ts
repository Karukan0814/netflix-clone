export type Favorited = 0 | 1 | null;

export type VideoInfoStats = {
  videoId: string;
  userId: string;
  favorited: Favorited;
  watched: boolean;
};
export type VideoDataForSection = {
  imgUrl?: string;
  videoId: string;
  title?: string;
  description?: string;
  publishTime?: string;
  channelTitle?: string;
  statistics?: string;
};

export type VideoDataDisplay = {
  title: string;
  imgUrl: string;
  description: string;
  publishTime: Date;
  channelTitle: string;
  statistics: number;
};
