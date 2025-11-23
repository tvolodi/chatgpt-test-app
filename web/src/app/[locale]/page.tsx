import type { Metadata } from "next";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/landing/HeroSection";
import FeatureSection from "../../components/landing/FeatureSection";
import LatestContentSection from "../../components/landing/LatestContentSection";
import AboutSection from "../../components/landing/AboutSection";

export const metadata: Metadata = {
  title: "AI-Dala | AI-driven CMS and search",
  description: "AI-Dala combines Next.js, Go APIs, and AI search to build secure, fast digital experiences.",
  openGraph: {
    title: "AI-Dala | AI-driven CMS and search",
    description: "AI-Dala combines Next.js, Go APIs, and AI search to build secure, fast digital experiences.",
    url: "https://ai-dala.com",
    siteName: "AI-Dala",
    images: [
      {
        url: "https://ai-dala.com/og-image.png", // Ensure this exists or use logo
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <LatestContentSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
