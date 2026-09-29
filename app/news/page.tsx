import type { Metadata } from "next";
import Link from "next/link";
import { FeaturedEvent } from "@/components/site/FeaturedEvent";
import { PageShell } from "@/components/site/PageShell";
import { festival } from "@/lib/festival";
import { getNewsItems } from "@/lib/news";

const featuredEventId = "2026-10-09-evening";

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
            {item.body.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="mt-2 festival-body">
                {paragraph}
              </p>
            ))}
            {item.link ? (
              <Link href={item.link.href} className="festival-link mt-3 inline-block">
                {item.link.label} →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
      <FeaturedEvent eventId={featuredEventId} />
    </PageShell>
  );
}
