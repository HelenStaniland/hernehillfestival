import type { Admission, AdmissionTicket } from "@/data/events";

const typeOrder: AdmissionTicket["type"][] = [
  "standard",
  "adult",
  "concession",
  "child",
  "family",
];

export function customerTotalPence(ticket: AdmissionTicket) {
  return (
    Math.round(ticket.price * 100) + Math.round((ticket.bookingFee ?? 0) * 100)
  );
}

export function formatGbpFromPence(pence: number) {
  if (pence % 100 === 0) return `£${pence / 100}`;
  return `£${(pence / 100).toFixed(2)}`;
}

function defaultLabel(type: AdmissionTicket["type"]) {
  switch (type) {
    case "standard":
      return "Standard";
    case "adult":
      return "Adult";
    case "concession":
      return "Concessions";
    case "child":
      return "Child";
    case "family":
      return "Family";
  }
}

export function offerName(ticket: AdmissionTicket) {
  if (ticket.label) return ticket.label;
  if (ticket.type === "concession") return "Concession";
  return defaultLabel(ticket.type);
}

function ticketPhrase(ticket: AdmissionTicket) {
  const total = customerTotalPence(ticket);
  if (ticket.type === "child" && total === 0) return "Children FREE";
  if (ticket.type === "standard" && !ticket.label) {
    return formatGbpFromPence(total);
  }
  const label =
    ticket.type === "concession" && !ticket.label
      ? "Concessions"
      : (ticket.label ?? defaultLabel(ticket.type));
  return total === 0 ? `${label} FREE` : `${label} ${formatGbpFromPence(total)}`;
}

function orderedTickets(tickets: AdmissionTicket[]) {
  return [...tickets].sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type),
  );
}

export function formatAdmission(admission: Admission) {
  if (admission.kind === "free") {
    return {
      summary: admission.registrationRequired
        ? "FREE · Registration required"
        : "FREE",
    };
  }

  const tickets = orderedTickets(admission.tickets);
  const withFee = tickets.filter((ticket) => (ticket.bookingFee ?? 0) > 0);
  const freeTypes = tickets.filter((ticket) => customerTotalPence(ticket) === 0);
  const feeNote =
    withFee.length > 0 && freeTypes.length > 0 && withFee.length === 1
      ? `${withFee[0].label ?? defaultLabel(withFee[0].type)} price includes booking fee`
      : withFee.length > 0
        ? "Includes booking fee"
        : undefined;

  return {
    summary: tickets.map(ticketPhrase).join(" · "),
    feeNote,
  };
}

type EventOffer = {
  "@type": "Offer";
  name?: string;
  price: number;
  priceCurrency: "GBP";
  url?: string;
};

export function admissionOffers(
  admission: Admission,
  ticketUrl?: string,
): EventOffer | EventOffer[] {
  const url = ticketUrl ? { url: ticketUrl } : {};

  if (admission.kind === "free") {
    return {
      "@type": "Offer",
      price: 0,
      priceCurrency: "GBP",
      ...url,
    };
  }

  const offers = orderedTickets(admission.tickets).map((ticket) => ({
    "@type": "Offer" as const,
    name: offerName(ticket),
    price: customerTotalPence(ticket) / 100,
    priceCurrency: "GBP" as const,
    ...url,
  }));

  return offers.length === 1 ? offers[0] : offers;
}
