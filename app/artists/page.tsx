import type { Metadata } from "next";
import Image from "next/image";
import { ArtistDetails } from "@/components/site/ArtistDetails";
import { PageShell } from "@/components/site/PageShell";
import { artists } from "@/data/artists";
import { festival } from "@/lib/festival";

export const metadata: Metadata = {
  title: `Artists | ${festival.name}`,
  description: "Artists performing at the festival.",
};

export default function ArtistsPage() {
  return (
    <PageShell
      title="Artists"
      description="Acts appearing at this year’s festival."
    >
      <ul className="space-y-6">
        {artists.map((artist) => (
          <li key={artist.id} className="festival-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {artist.image ? (
                <div className="relative aspect-[4/3] w-full shrink-0 bg-festival-blue-deep sm:aspect-auto sm:h-48 sm:w-48">
                  <Image
                    src={`/${artist.image}`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </div>
              ) : null}
              <div className="p-5 sm:p-6">
                <ArtistDetails artist={artist} prominentName />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
