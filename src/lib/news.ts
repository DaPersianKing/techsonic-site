export const topics = [
  'Telecom',
  'Networking',
  'Cloud',
  'Cybersecurity',
  'Enterprise IT',
  'AI and Automation',
] as const;
export type Topic = (typeof topics)[number];
export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  published: string;
  topic: Topic;
  summary: string;
}
export interface NewsBrief {
  updated: string | null;
  articles: NewsArticle[];
  stale: boolean;
  partial?: boolean;
}
