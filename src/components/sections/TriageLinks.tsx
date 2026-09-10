"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export interface TriageLane {
  id: string;
  question: string;
  label: string;
  href: string;
}

/**
 * Three concrete lanes answering "what am I looking at" better than a generic
 * browse button. The GA4 event is the point: it is the first signal of what
 * share of first-time visitors are non-developers, which is the open question
 * behind the whole content-first pivot.
 */
export function TriageLinks({ lanes }: { lanes: TriageLane[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-x-6 gap-y-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">
      {lanes.map((lane) => (
        <li key={lane.id} className="flex items-center gap-1.5">
          <span className="text-muted-foreground">{lane.question}</span>
          <Link
            href={lane.href}
            onClick={() => track("home_triage", { lane: lane.id })}
            className="font-medium text-primary underline underline-offset-4 hover:text-foreground"
          >
            {lane.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
