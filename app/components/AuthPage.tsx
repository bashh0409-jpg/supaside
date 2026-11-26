import Link from "next/link";
import LoginForm from "../login/LoginForm";

export default function AuthPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#07100f] px-4 pb-24 pt-20 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] h-[28rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-950/30 blur-[110px]"
      />

      <Link
        href="/"
        className="absolute left-6 top-6 z-10 text-lg font-semibold tracking-[-0.06em] sm:left-8 sm:top-8"
      >
        Supaside<span className="text-emerald-400">.</span>
      </Link>

      <section className="relative z-10 w-full max-w-[390px]">
        <header className="mb-6 text-center">
          <h1 className="font-semibold uppercase text-lg text-white">
            Sign in or create an account.
          </h1>
          <p className="my-2 text-sm font-mono tracking-tighter font-medium mute">
            We&apos;ll email you a secure link.
          </p>{" "}
        </header>

        <div className="rounded-3xl bg-white p-5 text-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <LoginForm />
        </div>
      </section>

      <footer className="absolute inset-x-0 bottom-5 z-10 px-4 text-center text-xs font-medium leading-5 text-white">
        Need a hand? Get in touch with our team.
        <p className="mt-1">© Supaside. Discover your next favourite.</p>
      </footer>
    </main>
  );
}
