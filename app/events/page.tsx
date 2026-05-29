import type { Metadata } from "next";
import { EventsBrowser } from "@/components/site/EventsBrowser";
import { PageShell } from "@/components/site/PageShell";
import { venues } from "@/data/venues";
import { festival } from "@/lib/festival";
import { getProgramme } from "@/lib/programme";

export const metadata: Metadata = {
  title: `Events | ${festival.name}`,
  description: "Festival events, times and venues.",
};

export default function EventsPage() {
  const programme = getProgramme();

  return (
    <PageShell title="Events" description="All times local.">
      {programme.length === 0 ? (
        <p className="festival-body">Events will be listed here soon.</p>
      ) : (
        <EventsBrowser programme={programme} venues={venues} />
      )}
    </PageShell>
  );
}
