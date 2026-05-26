import Link from "next/link";
import { festival, navLinks, pastFestivalsLink } from "@/lib/festival";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/15 bg-festival-blue-deep px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} {festival.name}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-semibold text-white/90 hover:text-festival-mint"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={pastFestivalsLink.href}
                className="text-sm font-semibold text-white/90 hover:text-festival-mint"
              >
                {pastFestivalsLink.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
