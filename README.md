This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase authentication

The `/login` and `/signup` routes use the same email form and magic-link flow.
Supabase signs in existing users or creates new accounts automatically. Both
routes also support Google, Apple, and X OAuth 2.0. Add the Supabase project
URL and public key to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-key
RESEND_API_KEY=re_your_server_side_key
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also accepted as a key name. Never use a
Supabase secret or service-role key in a `NEXT_PUBLIC_` variable. Keep
`RESEND_API_KEY` server-side; add it to your deployment's environment variables
as well.

### Profile data

The account form stores names and phone numbers in `public.profiles`. Apply the
profile access and account-deletion migrations to your Supabase project with
`supabase db push` after linking the project. Account deletion also requires
`SUPABASE_SERVICE_ROLE_KEY` in the server environment. Keep it secret and never
prefix it with `NEXT_PUBLIC_`.

Enable the Email, Google, Apple, and X / Twitter (OAuth 2.0) providers under
**Authentication → Sign In / Providers** in Supabase. Configure each OAuth
provider's credentials there. For X, use its OAuth 2.0 client ID and client
secret. Then add
`http://localhost:3000/auth/callback` and your deployed
`https://your-domain/auth/callback` URL to Supabase's allowed redirect URLs.
Use the Supabase OAuth callback URL shown in the provider settings as the
authorized redirect URL in the Google, Apple, and X developer consoles.
Configure email delivery in Supabase for magic links, especially before
production.

### Send auth and welcome emails with Resend

1. Verify `supaside.store` in Resend and configure the DNS records Resend
   provides.
2. In Supabase, open **Authentication → SMTP Settings**, enable custom SMTP,
   and use:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: a Resend API key
   - Sender email: `info@supaside.store`
   - Sender name: `Supaside`
3. Keep Supabase's magic-link email template using `{{ .ConfirmationURL }}`.
   The sign-up callback sends a separate welcome email from
   `Supaside <info@supaside.store>` after the email link is verified.
4. Add `RESEND_API_KEY` to `.env.local` and your deployment environment. This
   key is used only by the server-side welcome-email sender. Do not commit the
   actual key.

`orders@supaside.store` can be used as the sender for future order emails; the
store does not yet have an implemented checkout/order-email flow.

## Mux hero video

Set `NEXT_PUBLIC_MUX_PLAYBACK_ID` in `.env.local` to the public playback ID of
your Mux asset. The hero plays that HLS stream; until it is set, it uses
`public/hero.mp4`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
