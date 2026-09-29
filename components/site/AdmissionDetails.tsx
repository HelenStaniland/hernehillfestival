import type { Admission } from "@/data/events";
import { formatAdmission } from "@/lib/admission";

type AdmissionDetailsProps = {
  admission: Admission;
  compact?: boolean;
};

export function AdmissionDetails({
  admission,
  compact = false,
}: AdmissionDetailsProps) {
  const { summary, feeNote } = formatAdmission(admission);

  return (
    <div className={compact ? "mt-2" : "mt-5"}>
      <p
        className={
          compact
            ? "text-sm font-semibold text-white"
            : "font-semibold text-white"
        }
      >
        {summary}
      </p>
      {feeNote ? (
        <p className={compact ? "text-xs text-white/70" : "mt-0.5 text-sm text-white/70"}>
          {feeNote}
        </p>
      ) : null}
    </div>
  );
}
