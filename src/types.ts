export interface Reel {
  creator: string;
  followers: number;
  views: number;
  likes: number;
  comments: number;
  post_url: string;
  media_url: string | null;
}

export interface Metadata {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
  scrapedPosts: number;
  percentageScraped: number;
}

export interface FetchReelsResponse {
  sessionId: string;
  hasMore: boolean;
  reels: Reel[];
  metadata: Metadata;
  status: 'active' | 'completed';
}
