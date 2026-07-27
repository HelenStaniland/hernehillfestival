"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      // Existing member (double opt-in) counts as success:
      if (!response.ok) {
        if (response.status === 409) {
          setFormState("success");
          setMessage(
            result.message ??
              "That address is already registered or awaiting confirmation.",
          );
          return;
        }

        setFormState("error");
        setMessage(
          result.message ?? "We couldn't complete your signup. Please try again.",
        );
        return;
      }

      setFormState("success");
      setMessage(
        result.message ??
          "Thank you. Please check your inbox and confirm your subscription.",
      );
      setEmail("");
    } catch {
      setFormState("error");
      setMessage(
        "We couldn't complete your signup. Please try again shortly."
      );
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mt-10 festival-card px-6 py-10 text-white sm:px-10"
    >
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <h2
            id="newsletter-heading"
            className="font-display text-3xl tracking-tight sm:text-4xl"
          >
            Stay in tune with the festival
          </h2>

          <p className="mt-4 text-lg leading-8 text-white/90">
            Be the first to hear about festival news, artist announcements and
            ticket releases.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>

            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              disabled={formState === "submitting"}
              className="w-full rounded-md border border-white/30 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-festival-mint disabled:cursor-wait disabled:opacity-70"
            />
          </div>

          <button
            type="submit"
            disabled={formState === "submitting"}
            className="rounded-lg border border-festival-mint/50 px-6 py-3 text-sm font-semibold text-festival-mint shadow-sm transition hover:bg-festival-mint/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-festival-blue-deep disabled:cursor-wait disabled:opacity-70"
          >
            {formState === "submitting"
              ? "Joining…"
              : "Join the mailing list"}
          </button>
        </form>

        <p className="mt-4 max-w-2xl text-sm text-white/75">
          We only send occasional updates about the festival. You can unsubscribe
          at any time.
        </p>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-5 max-w-2xl rounded-md px-4 py-3 text-sm ${
              formState === "success"
                ? "bg-white/15 text-white border border-white/20"
                : "bg-festival-coral/20 text-white border border-festival-coral/25"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}