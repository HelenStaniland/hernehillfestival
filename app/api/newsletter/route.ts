import { NextResponse } from "next/server";

type MailchimpError = {
  title?: string;
  detail?: string;
  status?: number;
};

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      typeof body.email !== "string"
    ) {
      return NextResponse.json(
        { message: "Please enter an email address." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !serverPrefix || !audienceId) {
      console.error("Mailchimp environment variables are missing.");

      return NextResponse.json(
        { message: "Newsletter signup is temporarily unavailable." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`website:${apiKey}`).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,

          // Use "pending" for double opt-in:
          // Mailchimp sends a confirmation email before subscribing them.
          status: "pending",
        }),
      }
    );

    if (response.ok) {
      return NextResponse.json({
        message:
          "Thank you. Please check your inbox and confirm your subscription.",
      });
    }

    let error: MailchimpError = {};
    try {
      error = (await response.json()) as MailchimpError;
    } catch {
      // Ignore invalid JSON error bodies.
    }

    const isMemberExists =
      response.status === 400 &&
      (error.title === "Member Exists" ||
        error.detail?.toLowerCase().includes("already a list member"));

    if (isMemberExists) {
      return NextResponse.json(
        {
          message:
            "That address is already registered or awaiting confirmation.",
        },
        { status: 409 },
      );
    }

    // Mailchimp returns 400 for validation issues (email format, invalid
    // resource, etc). We already validate locally, so this is primarily a
    // "invalid email" catch-all.
    if (response.status === 400) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    console.error("Mailchimp signup error:", error);

    return NextResponse.json(
      {
        message:
          "We couldn't complete your signup just now. Please try again shortly.",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Newsletter route error:", error);

    return NextResponse.json(
      {
        message:
          "We couldn't complete your signup just now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}