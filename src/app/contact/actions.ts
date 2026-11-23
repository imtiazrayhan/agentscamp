"use server";

import { z } from "zod";
import { site } from "@/lib/site";
import { contactTopics, type ContactTopic } from "./topics";

type Field = "name" | "email" | "topic" | "message";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  /** Echoed back so the fields keep their text: React resets a form after its action runs. */
  values?: Partial<Record<Field, string>>;
};

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(200, "Keep your email under 200 characters."),
  topic: z.enum(Object.keys(contactTopics) as [ContactTopic, ...ContactTopic[]], {
    errorMap: () => ({ message: "Choose a topic." }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters.")
    .max(5000, "Keep your message under 5,000 characters."),
});

const sendFailed = `Your message couldn't be sent. Please try again, or email ${site.contactEmail}.`;

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: the field is hidden from people, so only bots fill it. They get
  // the success screen and nothing is sent.
  if (formData.get("website")) return { status: "sent" };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as Field;
      errors[field] ??= issue.message;
    }
    return { status: "error", message: "Check the highlighted fields.", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set; message not sent.");
    return { status: "error", message: sendFailed, values };
  }

  const { name, email, topic, message } = parsed.data;
  const topicLabel = contactTopics[topic];
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? `${site.name} <noreply@agentscamp.com>`,
        to: [site.contactEmail],
        reply_to: email,
        subject: `[Contact] ${topicLabel}: ${name.replace(/\s+/g, " ")}`,
        text: `Name: ${name}\nEmail: ${email}\nTopic: ${topicLabel}\n\n${message}\n`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[contact] Resend returned ${res.status}: ${await res.text()}`);
      return { status: "error", message: sendFailed, values };
    }
  } catch (err) {
    console.error("[contact] Request to Resend failed:", err);
    return { status: "error", message: sendFailed, values };
  }

  return { status: "sent" };
}
