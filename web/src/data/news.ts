export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  published_at: string; // ISO8601
};

export const newsItems: NewsItem[] = [
  {
    id: "news-001",
    title: "AI-Dala launches master-class series",
    summary: "New live sessions on building AI-first products with the AI-Dala stack.",
    url: "/news/master-class-launch",
    image: "/AI-Dala-logo.png",
    published_at: "2025-11-15T09:00:00Z"
  },
  {
    id: "news-002",
    title: "AI search pipeline reaches milestone",
    summary: "Hybrid search and embeddings now power content discovery across the platform.",
    url: "/news/ai-search-milestone",
    image: "/AI-Dala-logo.png",
    published_at: "2025-11-10T12:00:00Z"
  },
  {
    id: "news-003",
    title: "Community spotlight: creators from the Steppe",
    summary: "Entrepreneurs, developers, and students share their AI-Dala journeys.",
    url: "/news/community-spotlight",
    image: "/AI-Dala-logo.png",
    published_at: "2025-11-05T08:30:00Z"
  }
];
