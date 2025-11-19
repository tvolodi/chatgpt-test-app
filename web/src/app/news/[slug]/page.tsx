import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchNewsItem } from "../services";

export const revalidate = 1800; // 30m

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = await fetchNewsItem(params.slug);
  if (!item) return {};

  const title = `AI-Dala News | ${item.title}`;
  const description = item.summary;
  const canonical = `https://ai-dala.com/news/${item.slug}`;
  const image = item.image ?? "/AI-Dala-logo.png";

  return {
    title,
    description,
    metadataBase: new URL("https://ai-dala.com"),
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: image }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function NewsDetail({ params }: { params: Params }) {
  const item = await fetchNewsItem(params.slug);
  if (!item) {
    return notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    datePublished: item.published_at,
    dateModified: item.published_at,
    author: { "@type": "Organization", name: "AI-Dala" },
    mainEntityOfPage: `https://ai-dala.com/news/${item.slug}`,
    image: item.image ? [item.image] : undefined
  };

  return (
    <main style={containerStyle}>
      <p style={{ color: "#3A9BDC", fontWeight: 700, margin: "0 0 8px" }}>AI-Dala News</p>
      <h1 style={{ margin: "0 0 12px", fontSize: "32px", color: "#2B2B2B" }}>{item.title}</h1>
      <p style={{ margin: "0 0 16px", color: "#4B5563" }}>{formatDate(item.published_at)}</p>
      {item.image && (
        <div style={{ marginBottom: 16 }}>
          <Image src={item.image} alt={item.title} width={800} height={450} style={{ width: "100%", height: "auto" }} />
        </div>
      )}
      <article
        style={{ lineHeight: 1.7, fontSize: "16px", color: "#2B2B2B", marginBottom: 24 }}
        dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <ShareLink href={`https://t.me/share/url?url=https://ai-dala.com/news/${item.slug}`} label="Telegram" />
        <ShareLink
          href={`https://www.linkedin.com/sharing/share-offsite/?url=https://ai-dala.com/news/${item.slug}`}
          label="LinkedIn"
        />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        padding: "10px 14px",
        borderRadius: 10,
        background: "#E6C68E",
        color: "#2B2B2B",
        fontWeight: 700,
        textDecoration: "none",
        minWidth: 120,
        textAlign: "center"
      }}
      aria-label={`Share on ${label}`}
    >
      Share on {label}
    </a>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "24px 16px",
  fontFamily: "Inter, system-ui, sans-serif"
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
