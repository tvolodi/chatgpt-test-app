import Link from "next/link";
import type { NewsItem } from "../services";

export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16
        }}
      >
        {items.map((item) => (
          <article
            key={item.id + item.slug}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <p style={{ margin: 0, color: "#4B5563" }}>{formatDate(item.published_at)}</p>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#2B2B2B" }}>{item.title}</h2>
            <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6 }}>{item.summary}</p>
            <Link href={`/news/${item.slug}`} style={linkStyle} aria-label={`${item.title} article`}>
              Read more
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

const linkStyle: React.CSSProperties = {
  color: "#3A9BDC",
  fontWeight: 700,
  textDecoration: "none"
};
