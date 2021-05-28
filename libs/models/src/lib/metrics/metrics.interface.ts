export interface IMetrics {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tweetID: string;
  retweets: number;
  favorites: number;
  replies: number;
  media_clicks: number;
  impressions: number;
}
