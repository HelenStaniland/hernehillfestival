type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-festival-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight text-festival-cream sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-festival-cream/70 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
