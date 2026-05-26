import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

type PageShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

export function PageShell({ children, title, description }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="festival-main px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 border-b-4 border-festival-gold pb-4">
            <h1 className="festival-page-title">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-2xl festival-body">{description}</p>
            ) : null}
          </header>
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
