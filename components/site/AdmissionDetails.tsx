import type { Admission } from "@/data/events";
import { formatAdmission } from "@/lib/admission";

type AdmissionDetailsProps = {
  admission: Admission;
  soldOut?: boolean;
  compact?: boolean;
};

export function AdmissionDetails({
  admission,
  soldOut = false,
  compact = false,
}: AdmissionDetailsProps) {
  const { summary, feeNote } = formatAdmission(admission);

  return (
    <div className={compact ? "mt-2" : "mt-5"}>
      <p
        className={
          soldOut
            ? compact
              ? "text-sm font-bold tracking-wide text-festival-coral"
              : "font-bold tracking-wide text-festival-coral"
            : compact
              ? "text-sm font-semibold text-white"
              : "font-semibold text-white"
        }
      >
        {soldOut ? "SOLD OUT" : summary}
      </p>
      {feeNote && !soldOut ? (
        <p className={compact ? "text-xs text-white/70" : "mt-0.5 text-sm text-white/70"}>
          {feeNote}
        </p>
      ) : null}
    </div>
  );
}
