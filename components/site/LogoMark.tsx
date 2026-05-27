type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <div
      aria-hidden
      className={`festival-logo-mark shrink-0 ${className ?? ""}`}
    />
  );
}
