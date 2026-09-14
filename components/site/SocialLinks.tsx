import { socialLinks } from "@/lib/festival";

const iconClassName = "h-5 w-5";

const icons = {
  twitter: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={iconClassName}
      fill="currentColor"
    >
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.37 8.54 8.54 0 0 1-2.71 1.04 4.26 4.26 0 0 0-7.26 3.88A12.09 12.09 0 0 1 3.15 4.6a4.26 4.26 0 0 0 1.32 5.68 4.22 4.22 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.18 4.27 4.27 0 0 1-1.92.07 4.26 4.26 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.06 12.06 0 0 0 6.53 1.91c7.84 0 12.13-6.5 12.13-12.13 0-.18 0-.37-.01-.55A8.66 8.66 0 0 0 22.46 6z" />
    </svg>
  ),
  instagram: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={iconClassName}
      fill="currentColor"
    >
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm10.25 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  ),
  facebook: (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={iconClassName}
      fill="currentColor"
    >
      <path d="M13.5 21v-7.1h2.39l.36-2.78H13.5V9.35c0-.76.21-1.28 1.3-1.28H16.4V5.58A17.7 17.7 0 0 0 14.07 5C11.7 5 10.08 6.45 10.08 9.04v2.08H7.6v2.78h2.48V21h3.42z" />
    </svg>
  ),
} as const;

type SocialLinksProps = {
  className?: string;
};

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <nav aria-label="Social media" className={className}>
      <ul className="flex items-center gap-1">
        {socialLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-festival-mint"
            >
              <span className="sr-only">{link.label}</span>
              {icons[link.id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
