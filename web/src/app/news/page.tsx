import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchNews } from "./services";
import { NewsClient } from "./client";
import { NewsFilters } from "./ui/filters";
import { NewsList } from "./ui/news-list";
import { LoadMoreButton } from "./ui/load-more";
import { CollectionSchema } from "./ui/schema";

export const revalidate = 1800; // 30m

export const metadata: Metadata = {
  title: "AI-Dala News | Latest updates",
  description: "Stay current with AI-Dala updates, OpenAI news, tools, and market insights.",
  metadataBase: new URL("https://ai-dala.com"),
  alternates: { canonical: "/news" },
  openGraph: {
    title: "AI-Dala News | Latest updates",
    description: "Stay current with AI-Dala updates, OpenAI news, tools, and market insights.",
    url: "https://ai-dala.com/news",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Dala News | Latest updates",
    description: "Stay current with AI-Dala updates, OpenAI news, tools, and market insights."
  }
};

const PAGE_SIZE = 10;
const FILTERS = ["OpenAI", "Tools", "Market", "AI-Dala updates"] as const;
export type Category = (typeof FILTERS)[number];

export default async function NewsPage({
  searchParams
}: {
  searchParams?: { page?: string; category?: string };
}) {
  const page = Math.max(Number(searchParams?.page ?? 1), 1);
  const category = searchParams?.category as Category | undefined;

  if (category && !FILTERS.includes(category)) {
    return notFound();
  }

  const { items, total } = await fetchNews({ page, pageSize: PAGE_SIZE, category });

  return (
    <main style={containerStyle}>
      <header style={{ marginBottom: 24 }}>
        <p style={{ color: "#3A9BDC", fontWeight: 700, margin: "0 0 8px" }}>AI-Dala News</p>
        <h1 style={{ margin: "0 0 12px", fontSize: "32px", color: "#2B2B2B" }}>Latest updates</h1>
        <p style={{ margin: 0, fontSize: "16px", color: "#2B2B2B" }}>
          Stay current with AI-Dala updates, OpenAI news, tools, and market insights.
        </p>
      </header>

      <NewsFilters filters={FILTERS} active={category} />

      <Suspense fallback={<p>Loading news...</p>}>
        <NewsClient
          initialItems={items}
          initialTotal={total}
          initialPage={page}
          pageSize={PAGE_SIZE}
          category={category}
        />
      </Suspense>

      <CollectionSchema items={items.map((i) => ({ slug: i.slug, title: i.title }))} />
    </main>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px 16px",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#2B2B2B"
};

export const dynamic = "force-static";
