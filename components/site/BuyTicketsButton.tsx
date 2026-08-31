type BuyTicketsButtonProps = {
  href: string;
  size?: "sm" | "md";
};

export function BuyTicketsButton({
  href,
  size = "sm",
}: BuyTicketsButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        size === "md"
          ? "inline-flex items-center gap-2 rounded-lg bg-festival-mint px-5 py-2.5 text-sm font-semibold text-festival-ink hover:bg-white"
          : "inline-flex items-center gap-2 rounded-lg bg-festival-mint px-3 py-1.5 text-sm font-semibold text-festival-ink hover:bg-white"
      }
    >
      Buy tickets
    </a>
  );
}
