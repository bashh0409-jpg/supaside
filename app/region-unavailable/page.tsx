import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Available in South Africa | Supaside",
  description: "Supaside is currently available only in South Africa.",
};

export default function RegionUnavailablePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-5 py-16 text-zinc-950">
      <img
        src="/logo.jpg"
        alt="Region Unavailable"
        className="mb-6 h-30 w-30"
      />
      <p className="text-sm max-w-xs text-justify leading-tight text-center cursor-pointer font-semibold">
        {" "}
        Supaside is not available in your region yet. We hope to bring our store
        to more places in the future. Check back later or  <a href="mailto:info@supaside.store" className="underline">contact us</a> for more information.
      </p>
      
    </main>
  );
}
