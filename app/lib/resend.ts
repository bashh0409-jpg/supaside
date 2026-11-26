import { Resend } from "resend";

export async function sendWelcomeEmail(to: string, userId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from: "Supaside <info@supaside.store>",
      to,
      subject: "Welcome to Supaside",
      text: "Welcome to Supaside. Your email is verified and your account is ready. Discover your next favourite at https://www.supaside.store.",
      html: "<p>Welcome to Supaside.</p><p>Your email is verified and your account is ready. Discover your next favourite at <a href=\"https://www.supaside.store\">supaside.store</a>.</p>",
    },
    { idempotencyKey: `welcome-user/${userId}` },
  );

  if (error) {
    throw new Error(`Resend could not send the welcome email: ${error.message}`);
  }
}
