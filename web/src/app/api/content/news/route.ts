import { NextResponse } from "next/server";

const API_BASE = process.env.NEWS_API_BASE || "http://localhost:4000/api/content/news";
export const revalidate = 1800;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("page_size") || "10";
  const category = searchParams.get("category");

  const url = new URL(API_BASE);
  url.searchParams.set("page", page);
  url.searchParams.set("page_size", pageSize);
  if (category) url.searchParams.set("category", category);

  try {
    const res = await fetch(url.toString(), { next: { revalidate } });
    if (!res.ok) {
      return NextResponse.json({ error_code: "UPSTREAM_ERROR", message: "Failed to fetch news" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ items: [], total: 0, page: Number(page), page_size: Number(pageSize) });
  }
}
