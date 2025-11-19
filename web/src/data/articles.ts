export type ArticleItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  updated_at: string; // ISO8601
};

export const articleItems: ArticleItem[] = [
  {
    id: "article-001",
    title: "Designing with AI-Dala: from concept to launch",
    summary: "A walkthrough of building a landing experience with the AI-Dala stack.",
    url: "/articles/designing-with-ai-dala",
    image: "/AI-Dala-logo.png",
    updated_at: "2025-11-12T10:00:00Z"
  },
  {
    id: "article-002",
    title: "Optimizing Next.js for ISR and SEO",
    summary: "Practical tips to meet p95 latency and SEO targets for public pages.",
    url: "/articles/optimizing-nextjs-isr-seo",
    image: "/AI-Dala-logo.png",
    updated_at: "2025-11-08T14:30:00Z"
  },
  {
    id: "article-003",
    title: "Securing auth flows with Keycloak",
    summary: "Configuring Keycloak clients and claims for AI-Dala applications.",
    url: "/articles/securing-auth-keycloak",
    image: "/AI-Dala-logo.png",
    updated_at: "2025-11-03T16:15:00Z"
  }
];
