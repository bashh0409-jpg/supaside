import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Supaside",
  description: "Learn how Supaside handles account and cart information.",
};

const sectionClass = "space-y-2";
const headingClass = "text-lg font-semibold";
const paragraphClass = "text-xs leading-tight font-semibold mute";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-8 text-zinc-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <img src="/logo.jpg" className="w-10" alt="" />
          </Link>
        </header>

        <article className="space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Privacy Policy
            </h1>
            <p className={paragraphClass}>Last updated: November 26, 2026</p>
            <p className={paragraphClass}>
              This policy explains what information Supaside processes when you
              visit our website or use its account features.
            </p>
          </header>

          <section className={sectionClass}>
            <h2 className={headingClass}>Information we process</h2>
            <p className={paragraphClass}>
              If you sign in or create an account, we process your email address
              and account details needed to authenticate you. If you choose
              Google or another social sign-in provider, that provider shares
              the basic profile information needed for sign-in, such as your
              email address and, when available, your name or profile image.
            </p>
            <p className={paragraphClass}>
              Products you add to your cart, including their sizes and
              quantities, are saved in local storage in your browser so the cart
              remains available on that device. The current cart is not
              connected to an order or checkout system.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>How we use information</h2>
            <p className={paragraphClass}>
              We use account information to provide sign-in, maintain your
              session, and help protect the service. We use cart information
              only to display and update your cart in the browser. We send
              account verification links and, after a new account is verified, a
              welcome email.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Service providers and sharing</h2>
            <p className={paragraphClass}>
              Supabase provides authentication and related account
              infrastructure. Google or another provider processes sign-in when
              you choose that option. Resend delivers authentication and welcome
              emails. These providers process information as needed to provide
              their services and under their own privacy terms. We do not sell
              personal information or use Google sign-in information for
              advertising.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Storage and retention</h2>
            <p className={paragraphClass}>
              Authentication uses browser session storage, such as cookies, to
              keep you signed in. Cart data stays in your browser until you
              remove it or clear the browser&apos;s site data. Account
              information is retained while needed to provide your account and
              meet operational or legal requirements. You can contact us to
              request access to or deletion of your account information.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Your choices and contact</h2>
            <p className={paragraphClass}>
              You can choose not to use social sign-in, clear cart data through
              your browser settings, or ask us about your personal information
              by emailing{" "}
              <a
                className="underline underline-offset-4"
                href="mailto:info@supaside.store"
              >
                info@supaside.store
              </a>
              .
            </p>
          </section>

          <nav className="border-t gap-2 flex border-zinc-200 pt-6">
            <Link
              href="/"
              className="text-sm  font-semibold border border-dashed p-1"
            >
              Supaside
            </Link>
            <Link
              href="/terms"
              className="text-sm font-semibold border border-dashed p-1"
            >
              Terms
            </Link>
          </nav>
        </article>
      </div>
    </main>
  );
}
