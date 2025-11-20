import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { newsItems } from "../data/news";
import { articleItems } from "../data/articles";
import { Navigation } from "./components/Navigation";

export const revalidate = 1800; // ISR revalidation every 30 minutes

export const metadata: Metadata = {
  title: "AI-Dala | AI-driven CMS and search",
  description: "AI-Dala combines Next.js, Go APIs, and AI search to build secure, fast digital experiences.",
  metadataBase: new URL("https://ai-dala.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI-Dala | AI-driven CMS and search",
    description: "AI-Dala combines Next.js, Go APIs, and AI search to build secure, fast digital experiences.",
    url: "https://ai-dala.com/",
    siteName: "AI-Dala",
    images: [
      {
        url: "/AI-Dala-logo.png",
        width: 1200,
        height: 630,
        alt: "AI-Dala circular horizon logo"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Dala | AI-driven CMS and search",
    description: "AI-Dala combines Next.js, Go APIs, and AI search to build secure, fast digital experiences.",
    images: ["/AI-Dala-logo.png"]
  }
};

const theme = {
  colors: {
    primary: "#3A9BDC", // Sky Blue
    secondary: "#2B2B2B", // Dark Gray
    accent: "#E6C68E", // Sand Beige
    background: "#F7F9FC",
    white: "#FFFFFF"
  },
  fonts: "Inter, system-ui, sans-serif"
};

const containerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px 16px",
  fontFamily: theme.fonts,
  color: theme.colors.secondary
};

const sectionStyle: CSSProperties = {
  padding: "32px 0",
  borderBottom: "1px solid #E5E7EB"
};

const headingStyle: CSSProperties = {
  fontSize: "32px",
  margin: "0 0 12px",
  color: theme.colors.secondary
};

const subheadingStyle: CSSProperties = {
  fontSize: "20px",
  margin: "0 0 12px",
  color: theme.colors.secondary
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default function HomePage() {
  const news = newsItems.slice(0, 5);
  const articles = articleItems.slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "AI-Dala",
        url: "https://ai-dala.com/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://ai-dala.com/search?q={query}",
          "query-input": "required name=query"
        }
      },
      {
        "@type": "Organization",
        name: "AI-Dala",
        url: "https://ai-dala.com/",
        logo: "https://ai-dala.com/AI-Dala-logo.png"
      },
      {
        "@type": "Person",
        name: "Volodymyr",
        url: "https://ai-dala.com/about"
      }
    ]
  };

  return (
    <div style={{ background: theme.colors.background, minHeight: "100vh" }}>
      <header
        style={{
          borderBottom: "1px solid #E5E7EB",
          background: theme.colors.white,
          position: "sticky",
          top: 0,
          zIndex: 10
        }}
      >
        <div style={{ ...containerStyle, display: "flex", alignItems: "center", gap: 12, padding: "16px" }}>
          <Image src="/AI-Dala-logo.png" alt="AI-Dala logo" width={48} height={48} priority />
          <Navigation />
        </div>
      </header>

      <main style={containerStyle}>
        <section style={{ ...sectionStyle, paddingTop: "48px" }} aria-labelledby="hero-heading">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 24,
              alignItems: "center"
            }}
          >
            <div>
              <p style={{ color: theme.colors.accent, margin: "0 0 8px", fontWeight: 600 }}>AI-Dala</p>
              <h1 id="hero-heading" style={{ fontSize: "40px", margin: "0 0 16px", color: theme.colors.secondary }}>
                Build, launch, and grow with AI-Dala.
              </h1>
              <p style={{ fontSize: "18px", margin: "0 0 24px", color: theme.colors.secondary }}>
                CMS + AI search + secure auth in one stack.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#contact" style={primaryButtonStyle} aria-label="Start with AI Dala">
                  Start with AI Dala
                </a>
                <a href="#contact" style={secondaryButtonStyle} aria-label="Join AI master-class">
                  Join AI master-class
                </a>
              </div>
            </div>
            {/* <div
              style={{
                background: theme.colors.white,
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                textAlign: "center"
              }}
            >
              <Image
                src="/AI-Dala-logo.png"
                alt="AI-Dala circular horizon logo"
                width={320}
                height={180}
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
                priority
              />
            </div> */}
          </div>
        </section>

        <section style={sectionStyle} id="about" aria-labelledby="about-heading">
          <h2 id="about-heading" style={headingStyle}>
            What is AI-Dala?
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: "16px", lineHeight: 1.6 }}>
            AI-Dala is an AI-driven CMS and search platform that blends Next.js, Go APIs, and secure identity to help you
            build performant, discoverable experiences.
          </p>
          <a href="/about" style={linkStyle}>
            Learn more about AI-Dala
          </a>
        </section>

        <section style={sectionStyle} aria-labelledby="for-whom-heading">
          <h2 id="for-whom-heading" style={headingStyle}>
            For whom
          </h2>
          <div style={pillRowStyle}>
            {["Entrepreneurs", "Developers", "Students"].map((aud) => (
              <div key={aud} style={pillStyle} role="article" aria-label={aud}>
                {aud}
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle} id="articles" aria-labelledby="articles-heading">
          <h2 id="articles-heading" style={headingStyle}>
            Latest articles
          </h2>
          <CardGrid>
            {articles.map((article) => (
              <Card key={article.id} title={article.title} summary={article.summary} href={article.url}>
                <small style={{ color: "#4B5563" }}>Updated {formatDate(article.updated_at)}</small>
              </Card>
            ))}
          </CardGrid>
        </section>

        <section style={sectionStyle} id="news" aria-labelledby="news-heading">
          <h2 id="news-heading" style={headingStyle}>
            AI News
          </h2>
          <CardGrid>
            {news.map((item) => (
              <Card key={item.id} title={item.title} summary={item.summary} href={item.url}>
                <small style={{ color: "#4B5563" }}>Published {formatDate(item.published_at)}</small>
              </Card>
            ))}
          </CardGrid>
        </section>

        <section style={sectionStyle} aria-labelledby="author-heading">
          <h2 id="author-heading" style={headingStyle}>
            About the project & author
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6 }}>
            AI-Dala is built by Volodymyr to bring AI-powered content management, search, and learning tools to creators
            across the Steppe and beyond.
          </p>
        </section>

        <section style={{ ...sectionStyle, borderBottom: "none" }} id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" style={headingStyle}>
            Contact & subscribe
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: "16px", lineHeight: 1.6 }}>
            Stay updated on AI news, master-classes, and platform releases.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="mailto:hello@ai-dala.com" style={secondaryButtonStyle}>
              Contact us
            </a>
            <a href="https://t.me/ai_dala" style={primaryButtonStyle} aria-label="Join AI Dala Telegram">
              Join Telegram
            </a>
            <a href="/subscribe" style={secondaryButtonStyle}>
              Subscribe
            </a>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}

const navLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: theme.colors.secondary,
  fontWeight: 600,
  fontSize: "14px",
  padding: "8px 12px",
  borderRadius: 8
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-block",
  background: theme.colors.primary,
  color: theme.colors.white,
  padding: "12px 16px",
  borderRadius: 10,
  fontWeight: 700,
  textDecoration: "none",
  minWidth: 160,
  textAlign: "center"
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-block",
  background: theme.colors.accent,
  color: theme.colors.secondary,
  padding: "12px 16px",
  borderRadius: 10,
  fontWeight: 700,
  textDecoration: "none",
  minWidth: 160,
  textAlign: "center"
};

const linkStyle: CSSProperties = {
  color: theme.colors.primary,
  fontWeight: 600,
  textDecoration: "none"
};

const pillRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap"
};

const pillStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 9999,
  background: theme.colors.white,
  color: theme.colors.secondary,
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
};

type CardProps = {
  title: string;
  summary: string;
  href: string;
  children?: ReactNode;
};

function Card({ title, summary, href, children }: CardProps) {
  return (
    <article
      style={{
        background: theme.colors.white,
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "100%"
      }}
    >
      <h3 style={{ margin: 0, fontSize: "20px", color: theme.colors.secondary }}>{title}</h3>
      <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6 }}>{summary}</p>
      {children}
      <a href={href} style={linkStyle} aria-label={`${title} article`}>
        Read more
      </a>
    </article>
  );
}

function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16
      }}
    >
      {children}
    </div>
  );
}
