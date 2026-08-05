"use client";

import { useState } from "react";
import { buildEventIcs, eventIcsFilename } from "@/lib/calendar";
import type { ProgrammeEvent } from "@/lib/programme";

type EventPageActionsProps = {
  event: ProgrammeEvent;
};

function downloadIcs(event: ProgrammeEvent) {
  const blob = new Blob([buildEventIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = eventIcsFilename(event);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function EventPageActions({ event }: EventPageActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/events/${event.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => downloadIcs(event)}
        className="inline-flex items-center gap-2 rounded-lg border border-festival-mint/50 px-3 py-1.5 text-sm font-semibold text-festival-mint hover:bg-festival-mint/10"
      >
        Add to calendar
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-festival-mint/50 px-3 py-1.5 text-sm font-semibold text-festival-mint hover:bg-festival-mint/10"
      >
        {copied ? "Link copied" : "Copy event link"}
      </button>
    </div>
  );
}
