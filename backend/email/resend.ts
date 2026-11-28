import { Resend } from "resend";

const SITE_URL = "https://www.supaside.store";
const FROM_EMAIL = "info@supaside.store";
const SUPPORT_EMAIL = "support@supaside.store";
const LOGO_URL = `${SITE_URL}/logo.jpg`;
const LOGO_CONTENT_ID = "supaside-logo";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWelcomeEmail(
  to: string,
  userId: string,
  name?: string | null,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const firstName = name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  const text = [
    greeting,
    "",
    "Welcome to Supaside. Your email is verified and your account is ready.",
    "",
    "Here's what you can do with your account:",
    "- Browse products across all categories",
    "- Track your orders and manage returns",
    "- Save your shipping details for faster checkout",
    "- Update your name and contact number any time from your profile",
    "",
    `Discover your next favourite at ${SITE_URL}.`,
    "",
    `Questions? Just reply to this email or write to ${SUPPORT_EMAIL}.`,
    "",
    "The Supaside team",
  ].join("\n");

  const html =
    `<p><img src="cid:${LOGO_CONTENT_ID}" alt="Supaside" width="40" height="40" /></p>` +
    `<p>${escapeHtml(greeting)}</p>` +
    "<p>Welcome to Supaside.</p>" +
    "<p>Your email is verified and your account is ready.</p>" +
    "<p>Here's what you can do with your account:</p>" +
    "<ul>" +
    "<li>Browse products across all categories</li>" +
    "<li>Track your orders and manage returns</li>" +
    "<li>Save your shipping details for faster checkout</li>" +
    "<li>Update your name and contact number any time from your profile</li>" +
    "</ul>" +
    `<p>Discover your next favourite at <a href="${SITE_URL}">supaside.store</a>.</p>` +
    `<p>Questions? Just reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>` +
    "<p>The Supaside team</p>";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from: `Supaside <${FROM_EMAIL}>`,
      to,
      replyTo: SUPPORT_EMAIL,
      subject: "Welcome to Supaside",
      text,
      html,
      attachments: [
        {
          path: LOGO_URL,
          filename: "supaside-logo.jpg",
          contentType: "image/jpeg",
          contentId: LOGO_CONTENT_ID,
        },
      ],
    },
    { idempotencyKey: `welcome-user/${userId}` },
  );

  if (error) {
    throw new Error(
      `Resend could not send the welcome email: ${error.message}`,
    );
  }
}
