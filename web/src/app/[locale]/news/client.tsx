"use client";

import { useMemo, useState } from "react";
import type { Category } from "./page";
import { NewsList } from "./ui/news-list";
import type { NewsItem } from "./services";

type Props = {
  initialItems: NewsItem[];
  initialTotal: number;
  initialPage: number;
  pageSize: number;
  category?: Category;
};

export function NewsClient({ initialItems, initialTotal, initialPage, pageSize, category }: Props) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [total] = useState(initialTotal);

  const hasMore = useMemo(() => page * pageSize < total, [page, pageSize, total]);

  async function loadMore() {
    const nextPage = page + 1;
    const params = new URLSearchParams({ page: String(nextPage), page_size: String(pageSize) });
    if (category) params.set("category", category);
    const res = await fetch(`/api/content/news?${params.toString()}`);
    const data = await res.json();
    setItems((prev) => [...prev, ...data.items]);
    setPage(nextPage);
  }

  return (
    <div>
      <NewsList items={items} />
      {hasMore && (
        <button
          onClick={loadMore}
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 10,
            background: "#3A9BDC",
            color: "#FFFFFF",
            fontWeight: 700,
            minWidth: 160,
            textAlign: "center",
            border: "none",
            marginTop: 16,
            cursor: "pointer"
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
}
