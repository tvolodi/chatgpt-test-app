const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
import type { Category } from "./page";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  bodyHtml: string;
  url: string;
  image?: string;
  published_at: string;
  tags?: string[];
};

type FetchParams = { page: number; pageSize: number; category?: Category };

export async function fetchNews({ page, pageSize, category }: FetchParams): Promise<{ items: NewsItem[]; total: number }> {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("page_size", String(pageSize));
  if (category) qs.set("category", category);

  try {
    const res = await fetch(`${API_BASE}/content/news?${qs.toString()}`, { next: { revalidate: 1800 } });
    if (!res.ok) {
      return fallbackList({ page, pageSize, category });
    }
    const data = (await res.json()) as { items: NewsItem[]; total: number };
    const mapped = data.items.map(mapItem);
    if (mapped.length < pageSize || data.total < pageSize) {
      const fb = fallbackList({ page, pageSize, category });
      return fb;
    }
    return { items: mapped, total: data.total };
  } catch {
    return fallbackList({ page, pageSize, category });
  }
}

export async function fetchNewsItem(slug: string): Promise<NewsItem | null> {
  try {
    const res = await fetch(`${API_BASE}/content/news/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      const local = generateLocal().find((n) => n.slug === slug);
      return local ? mapItem(local) : null;
    }
    const item = (await res.json()) as NewsItem;
    return mapItem(item);
  } catch {
    // fallback to local fixtures
    const local = generateLocal().find((n) => n.slug === slug);
    return local ? mapItem(local) : null;
  }
}

function fallbackList({ page, pageSize, category }: FetchParams): { items: NewsItem[]; total: number } {
  const all = generateLocal();
  const filtered = category ? all.filter((n) => n.tags?.includes(category)) : all;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total };
}

function generateLocal(): NewsItem[] {
  const now = new Date();
  const categories: Category[] = ["OpenAI", "Tools", "Market", "AI-Dala updates"];
  const items: NewsItem[] = [];
  for (let i = 0; i < 32; i++) {
    const cat = categories[i % categories.length];
    const published = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString();
    const slug = `local-news-${i}`;
    items.push({
      id: slug,
      slug,
      title: `Local News Item #${i + 1}`,
      summary: `Summary for ${cat} item #${i + 1}`,
      body: `# Local News Item #${i + 1}\n\nSummary for ${cat} item #${i + 1}.`,
      bodyHtml: markdownToHtml(`## Local News Item #${i + 1}\n\nSummary for ${cat} item #${i + 1}.`),
      url: `/news/${slug}`,
      image: "/AI-Dala-logo.png",
      published_at: published,
      tags: [cat]
    });
  }
  return items;
}

function mapItem(item: NewsItem): NewsItem {
  return {
    ...item,
    bodyHtml: markdownToHtml(item.body || item.summary || "")
  };
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\n$/gim, "<br>")
    .replace(/\n\n/gim, "<p>");
}
