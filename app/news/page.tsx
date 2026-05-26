import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { festival } from "@/lib/festival";
import { getNewsItems } from "@/lib/news";

export const metadata: Metadata = {
  title: `News | ${festival.name}`,
  description: "Festival news and updates.",
};

export default function NewsPage() {
  const items = getNewsItems();

  return (
    <PageShell title="News" description="Updates from the festival team.">
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.id} className="festival-card p-5 sm:p-6">
            <h2 className="font-display text-2xl tracking-wide text-white">
              {item.title}
            </h2>
            <p className="mt-2 festival-body">{item.body}</p>
            {item.link ? (
              <Link href={item.link.href} className="festival-link mt-3 inline-block">
                {item.link.label} →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
