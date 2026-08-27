import type { Sponsor, SponsorTier } from "@/data/sponsors";

const tierLabels: Record<SponsorTier, string> = {
  principal: "Principal sponsor",
  partner: "Sponsor",
  supporter: "Supporter",
};

type SponsorDetailsProps = {
  sponsor: Sponsor;
};

export function SponsorDetails({ sponsor }: SponsorDetailsProps) {
  return (
    <div className="flex h-full flex-col items-center text-center">
      {sponsor.logo ? (
        <div className="flex h-24 w-full items-center justify-center px-4 sm:h-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${sponsor.logo}`}
            alt={sponsor.name}
            className={`object-contain object-center ${
              sponsor.id === "half-moon-dental-centre"
                ? "max-h-[120%] max-w-[120%]"
                : "max-h-full max-w-full"
            }`}
          />
        </div>
      ) : null}
      <h2
        className={`font-display text-2xl tracking-wide text-white sm:text-3xl ${sponsor.logo ? "mt-4" : ""}`}
      >
        {sponsor.name}
      </h2>
      {sponsor.tier ? (
        <p className="festival-label mt-2">{tierLabels[sponsor.tier]}</p>
      ) : null}
      {sponsor.website ? (
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="festival-link mt-3 inline-block text-sm"
        >
          Visit website →
        </a>
      ) : null}
    </div>
  );
}
