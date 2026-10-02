const page = await fetch(
  "http://localhost:3000/events/2026-10-11-evening",
).then((r) => r.text());
console.log("new", page.includes("Responses — Joanna Forbes-L’Estrange"));
console.log("old by", page.includes("Responses — by Joanna Forbes-L’Estrange"));
