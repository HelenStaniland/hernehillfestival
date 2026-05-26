import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { SponsorDetails } from "@/components/site/SponsorDetails";
import { sponsors, type SponsorTier } from "@/data/sponsors";
import { festival } from "@/lib/festival";

const tierOrder: Record<SponsorTier, number> = {
  principal: 0,
  partner: 1,
  supporter: 2,
};

export const metadata: Metadata = {
  title: `Sponsors | ${festival.name}`,
  description: "Organisations supporting Herne Hill Music Festival.",
};

export default function SponsorsPage() {
  const sortedSponsors = [...sponsors].sort((a, b) => {
    const aTier = a.tier ? tierOrder[a.tier] : tierOrder.supporter;
    const bTier = b.tier ? tierOrder[b.tier] : tierOrder.supporter;
    return aTier - bTier;
  });

  return (
    <PageShell
      title="Sponsors"
      description="With thanks to the local organisations helping make the festival happen."
    >
      {sortedSponsors.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSponsors.map((sponsor) => (
            <li key={sponsor.id} className="festival-card p-5 sm:p-6">
              <SponsorDetails sponsor={sponsor} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="festival-body">Sponsor details coming soon.</p>
      )}
    </PageShell>
  );
}
