"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendContact, type ContactState } from "./actions";
import { contactTopics } from "./topics";

type Field = keyof NonNullable<ContactState["errors"]>;

const initialState: ContactState = { status: "idle" };

// The <Input> box, for the select and textarea, which have no primitive.
const control =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

  if (state.status === "sent") {
    return (
      // Focused on mount so screen readers announce the result.
      <div ref={(el) => el?.focus()} tabIndex={-1} className="flex items-start gap-3 focus:outline-none">
        <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-type-mint-ink" />
        <div>
          <p className="font-medium">Thanks, your message is on its way.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll reply by email to the address you gave.
          </p>
        </div>
      </div>
    );
  }

  const errorProps = (f: Field) =>
    state.errors?.[f]
      ? { "aria-invalid": true, "aria-describedby": `contact-${f}-error` }
      : {};

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldRow id="name" label="Name" error={state.errors?.name}>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={state.values?.name}
            {...errorProps("name")}
          />
        </FieldRow>
        <FieldRow id="email" label="Email" error={state.errors?.email}>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={state.values?.email}
            {...errorProps("email")}
          />
        </FieldRow>
      </div>

      <FieldRow id="topic" label="Topic" error={state.errors?.topic}>
        <select
          id="contact-topic"
          name="topic"
          required
          defaultValue={state.values?.topic ?? "general"}
          className={cn(control, "h-10")}
          {...errorProps("topic")}
        >
          {Object.entries(contactTopics).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow id="message" label="Message" error={state.errors?.message}>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={7}
          placeholder="For a correction, include the page URL and the evidence."
          defaultValue={state.values?.message}
          className={control}
          {...errorProps("message")}
        />
      </FieldRow>

      {/* Honeypot: off-screen and out of the tab order, so only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
        {state.status === "error" && state.message && (
          <p role="alert" className="text-sm text-type-coral-ink">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function FieldRow({
  id,
  label,
  error,
  children,
}: {
  id: Field;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`contact-${id}`} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`contact-${id}-error`} className="mt-1.5 text-sm text-type-coral-ink">
          {error}
        </p>
      )}
    </div>
  );
}
