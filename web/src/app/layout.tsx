import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Dala",
  description: "AI-Dala CMS and AI search platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
