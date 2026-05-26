import Link from "next/link";
import { festival } from "@/lib/festival";

const footerLinks = [
  { label: "Programme", href: "/programme" },
  { label: "Venues", href: "#venues" },
  { label: "Email", href: "mailto:hello@hernehillfestival.example" },
  { label: "Instagram", href: "https://instagram.com" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-festival-cream/15 bg-festival-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold text-festival-cream">
            {festival.name}
          </p>
          <p className="mt-2 text-sm text-festival-cream/60">
            {festival.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-festival-cream/70 transition-colors hover:text-festival-cream"
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-5xl text-xs text-festival-cream/40">
        © {new Date().getFullYear()} {festival.name}. All rights reserved.
      </p>
    </footer>
  );
}
