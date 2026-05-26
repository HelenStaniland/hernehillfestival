import { redirect } from "next/navigation";
import { pastFestivalsLink } from "@/lib/festival";

export default function ArchivePage() {
  redirect(pastFestivalsLink.href);
}
