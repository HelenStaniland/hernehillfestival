import Link from "next/link";

const accentStyles = {
  mint: "border-festival-mint/80 bg-white/10 hover:bg-white/20",
  purple: "border-festival-purple/70 bg-white/10 hover:bg-white/20",
  teal: "border-festival-teal/70 bg-white/10 hover:bg-white/20",
} as const;

type FeatureCardProps = {
  href: string;
  title: string;
  description: string;
  accent: keyof typeof accentStyles;
};

export function FeatureCard({ href, title, description, accent }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`festival-card block p-5 transition-colors ${accentStyles[accent]}`}
    >
      <h2 className="font-display text-2xl tracking-wide text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
        {description}
      </p>
      <span className="mt-3 inline-block text-sm font-bold text-festival-mint">
        Go →
      </span>
    </Link>
  );
}
