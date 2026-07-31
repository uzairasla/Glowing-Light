import { createHmac, timingSafeEqual } from "node:crypto";

type SendMessage = {
  to: string;
  organization: string;
  subject: string;
  previewText?: string | null;
  bodyText: string;
  ctaUrl?: string | null;
  ctaLabel?: string | null;
  unsubscribeUrl: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character] ?? character);
}

export function personalize(value: string, organization: string) {
  return value.replaceAll("{{organization}}", organization);
}

export function createUnsubscribeToken(email: string) {
  const secret = process.env.OUTREACH_UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error("OUTREACH_UNSUBSCRIBE_SECRET is not configured.");
  return createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string) {
  const expected = createUnsubscribeToken(email);
  if (expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function renderOutreachEmail(message: SendMessage) {
  const organization = escapeHtml(message.organization);
  const body = escapeHtml(personalize(message.bodyText, message.organization))
    .replace(/\r?\n\r?\n/g, "</p><p>")
    .replace(/\r?\n/g, "<br>");
  const cta = message.ctaUrl
    ? `<p style="margin:28px 0"><a href="${escapeHtml(message.ctaUrl)}" style="background:#0d7d83;color:#fff;padding:13px 20px;border-radius:10px;text-decoration:none;font-weight:700">${escapeHtml(message.ctaLabel || "Visit Glowing Light")}</a></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#f4f8fa;color:#153b55;font-family:Arial,sans-serif"><div style="display:none">${escapeHtml(message.previewText || "")}</div><div style="max-width:640px;margin:0 auto;padding:32px 18px"><div style="background:#fff;border:1px solid #dde8ee;border-radius:16px;padding:32px"><p>Hello ${organization} team,</p><p>${body}</p>${cta}<p style="color:#647b8c;font-size:13px;margin-top:32px">You received this one-to-one community outreach message from Glowing Light. <a href="${escapeHtml(message.unsubscribeUrl)}">Please do not contact this address again</a>.</p></div></div></body></html>`;
}

export async function sendWithResend(message: SendMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Resend is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: personalize(message.subject, message.organization),
      html: renderOutreachEmail(message),
      text: `${personalize(message.bodyText, message.organization)}\n\n${message.ctaUrl ?? ""}\n\nOpt out: ${message.unsubscribeUrl}`,
      headers: { "List-Unsubscribe": `<${message.unsubscribeUrl}>` },
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Resend rejected the message.");
  return payload as { id: string };
}
