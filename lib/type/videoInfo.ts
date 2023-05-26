export type Favorited = 0 | 1 | null;

export type VideoInfoStats = {
  videoId: string;
  userId: string;
  favorited: Favorited;
  watched: boolean;
};
