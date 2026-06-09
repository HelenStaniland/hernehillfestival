type HeronLogoProps = {
  className?: string;
};

export function HeronLogo({ className }: HeronLogoProps) {
  return (
    <div
      aria-hidden
      className={`festival-heron-logo shrink-0 ${className ?? ""}`}
    />
  );
}
