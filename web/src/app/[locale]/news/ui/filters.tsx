import Link from "next/link";
import type { Category } from "../page";

type Props = {
  filters: readonly Category[];
  active?: Category;
};

export function NewsFilters({ filters, active }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }} aria-label="Filters">
      <FilterPill href="/news" label="All" active={!active} />
      {filters.map((f) => (
        <FilterPill key={f} href={`/news?category=${encodeURIComponent(f)}`} label={f} active={active === f} />
      ))}
    </div>
  );
}

function FilterPill({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        padding: "10px 14px",
        borderRadius: 9999,
        background: active ? "#3A9BDC" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#2B2B2B",
        fontWeight: 700,
        textDecoration: "none",
        border: "1px solid #E5E7EB",
        minWidth: 80,
        textAlign: "center"
      }}
      aria-pressed={active}
    >
      {label}
    </Link>
  );
}
