import { NextResponse } from "next/server";

const API_BASE = process.env.NEWS_API_BASE || "http://localhost:4000/api/content/news";
export const revalidate = 1800;

// For now reuse news as placeholder articles feed
export async function GET() {
  const url = new URL(API_BASE);
  url.searchParams.set("page", "1");
  url.searchParams.set("page_size", "3");
  try {
    const res = await fetch(url.toString(), { next: { revalidate } });
    if (!res.ok) {
      return NextResponse.json({ error_code: "UPSTREAM_ERROR", message: "Failed to fetch articles" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data.items);
  } catch {
    return NextResponse.json([]);
  }
}
