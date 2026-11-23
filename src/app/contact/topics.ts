/**
 * Contact-form topics: value → label. A plain module because both the client
 * form (options) and the "use server" action (validation, subject line) need
 * it, and a "use server" file may only export async functions.
 */
export const contactTopics = {
  general: "General question",
  correction: "Correction to a page",
  listing: "Tool listing or sponsorship",
  partnership: "Partnership or press",
} as const;

export type ContactTopic = keyof typeof contactTopics;
