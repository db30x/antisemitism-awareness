export interface Tweet {
  id: string;
  content: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  timestamp: string;
  engagement: {
    replies: number;
    retweets: number;
    likes: number;
    views: number;
  };
  platform: 'twitter' | 'facebook' | 'instagram';
  category: 'hate_speech' | 'conspiracy' | 'discrimination' | 'other';
  tweetUrl: string;
}

export interface Statistics {
  totalIncidents: number;
  onlineHarassment: number;
  physicalAssaults: number;
  yearOverYearChange: {
    totalIncidents: number;
    onlineHarassment: number;
    physicalAssaults: number;
  };
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  subscribedAt: Date;
} 