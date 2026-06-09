type HeronMarkProps = {
  className?: string;
};

export function HeronMark({ className }: HeronMarkProps) {
  return (
    <div
      aria-hidden
      className={`festival-heron-mark shrink-0 ${className ?? ""}`}
    />
  );
}
