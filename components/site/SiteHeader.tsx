"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { festival, navLinks } from "@/lib/festival";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b-4 border-festival-mint bg-festival-blue-deep text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="font-display text-2xl leading-none tracking-wide text-white hover:text-festival-mint sm:text-3xl"
        >
          {festival.name}
        </Link>

        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-1 gap-y-1 sm:gap-x-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:text-base ${
                      isActive
                        ? "bg-festival-mint text-festival-ink"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
