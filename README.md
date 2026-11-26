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

The `/login` and `/signup` pages share an email magic-link flow: existing users
can sign in, and new users can complete account creation from the link. Both
pages also support Google, Apple, and Facebook OAuth. Add the Supabase project URL and
public key to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also accepted as a key name. Never use a
Supabase secret or service-role key in a `NEXT_PUBLIC_` variable.

Enable the Email, Google, Apple, and Facebook providers under
**Authentication → Sign In / Providers** in Supabase. Configure each OAuth
provider's credentials there, then add
`http://localhost:3000/auth/callback` and your deployed
`https://your-domain/auth/callback` URL to Supabase's allowed redirect URLs.
Use the Supabase OAuth callback URL shown in the provider settings as the
authorized redirect URL in the Google, Apple, and Facebook developer consoles.
Configure email delivery in Supabase for magic links, especially before
production.

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
