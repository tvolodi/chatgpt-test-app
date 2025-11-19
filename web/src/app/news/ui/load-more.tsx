import Link from "next/link";
import type { Category } from "../page";

type Props = {
  currentPage: number;
  pageSize: number;
  total: number;
  category?: Category;
};

export function LoadMoreButton({ currentPage, pageSize, total, category }: Props) {
  const nextPage = currentPage + 1;
  const hasMore = currentPage * pageSize < total;
  if (!hasMore) return null;

  const href = new URLSearchParams();
  href.set("page", String(nextPage));
  if (category) href.set("category", category);

  return (
    <Link
      href={`/news?${href.toString()}`}
      style={{
        display: "inline-block",
        padding: "12px 16px",
        borderRadius: 10,
        background: "#3A9BDC",
        color: "#FFFFFF",
        fontWeight: 700,
        textDecoration: "none",
        minWidth: 160,
        textAlign: "center"
      }}
    >
      Load more
    </Link>
  );
}
