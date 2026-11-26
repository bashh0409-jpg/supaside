import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Supaside",
  description: "Read the terms for using the Supaside website.",
};

const sectionClass = "space-y-2";
const headingClass = "text-lg font-semibold";
const paragraphClass = "text-sm leading-6 text-zinc-600";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-8 text-zinc-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 flex items-center justify-between border-b border-zinc-200 pb-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Supaside
          </Link>
          <Link href="/privacy" className="text-sm underline underline-offset-4">
            Privacy Policy
          </Link>
        </header>

        <article className="space-y-8">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Legal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Terms of Service
            </h1>
            <p className={paragraphClass}>Last updated: November 26, 2026</p>
            <p className={paragraphClass}>
              These terms apply when you access or use the Supaside website. By
              using the site, you agree to these terms.
            </p>
          </header>

          <section className={sectionClass}>
            <h2 className={headingClass}>Using Supaside</h2>
            <p className={paragraphClass}>
              You may use the site to browse products, manage a browser-based
              cart, and access account features. You agree to provide accurate
              information when signing in, keep your sign-in links private,
              and not misuse, disrupt, or attempt to gain unauthorized access
              to the site or its services.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Accounts</h2>
            <p className={paragraphClass}>
              Sign-in links are sent to the email address you provide. You are
              responsible for access to that email account and for activity
              carried out through your Supaside session. Contact us if you
              believe your account has been used without permission.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Products and checkout</h2>
            <p className={paragraphClass}>
              Product descriptions, prices, images, sizes, and availability
              are provided for browsing and may change or contain errors. The
              current site does not provide checkout or accept orders or
              payments. Adding an item to the cart does not create a purchase
              or reserve stock.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Site content and availability</h2>
            <p className={paragraphClass}>
              Site content and branding belong to Supaside or their respective
              owners and may not be copied or used in a way that infringes
              their rights. We may update, suspend, or remove site features or
              content. We work to keep the site available but cannot guarantee
              uninterrupted access.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Changes and contact</h2>
            <p className={paragraphClass}>
              We may update these terms as the site changes. The latest version
              will be published on this page with its updated date. Questions
              about these terms can be sent to{" "}
              <a className="underline underline-offset-4" href="mailto:info@supaside.store">
                info@supaside.store
              </a>
              .
            </p>
          </section>

          <nav className="border-t border-zinc-200 pt-6">
            <Link href="/" className="text-sm underline underline-offset-4">
              Back to Supaside
            </Link>
          </nav>
        </article>
      </div>
    </main>
  );
}
