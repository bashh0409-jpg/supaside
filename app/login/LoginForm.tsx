"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { FaApple, FaFacebookF  } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getSupabaseConfig } from "../lib/supabase/config";
import { MdOutlineAlternateEmail } from "react-icons/md";

type Provider = "google" | "apple" | "facebook";
const authErrorMessages: Record<string, string> = {
  auth_not_configured:
    "Authentication is not configured yet. Please try again later.",
  callback_failed:
    "That authentication link could not be verified. Please try again.",
  welcome_email_failed:
    "Your account is active, but we couldn't send the welcome email. Please contact info@supaside.store.",
};

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getAuthErrorCode() {
  return new URLSearchParams(window.location.search).get("error") ?? "";
}

function getServerAuthErrorCode() {
  return "";
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pendingMethod, setPendingMethod] = useState<
    "email" | Provider | null
  >(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const authErrorCode = useSyncExternalStore(
    subscribeToLocation,
    getAuthErrorCode,
    getServerAuthErrorCode,
  );
  const callbackError = authErrorMessages[authErrorCode];
  const displayedMessage = message || callbackError || "";
  const displayedIsError = message ? isError : Boolean(callbackError);

  function showMessage(message: string) {
    setIsError(false);
    setMessage(message);
  }

  function showError(error: unknown) {
    setIsError(true);
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("signups not allowed for otp")
    ) {
      setMessage(
        "Supabase rejected email sign-in or account creation. Confirm this app is using the project where “Allow new users to sign up” is enabled, then try again.",
      );
      return;
    }

    setMessage(
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : "Unable to send your link. Please try again.",
    );
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const config = getSupabaseConfig();
    if (!config) {
      showError(
        "Authentication is not configured yet. Add the Supabase URL and public key to your environment.",
      );
      return;
    }

    setPendingMethod("email");
    try {
      const supabase = createBrowserClient(config.url, config.key);
      const emailRedirectTo = new URL(
        "/auth/callback",
        window.location.origin,
      );
      emailRedirectTo.searchParams.set("welcome", "1");

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: emailRedirectTo.toString(),
          shouldCreateUser: true,
          data: { signup_flow: "email" },
        },
      });

      if (error) {
        showError(error);
      } else {
        showMessage(
          "Check your inbox for a secure link to sign in or finish creating your account.",
        );
      }
    } catch (error) {
      showError(error);
    } finally {
      setPendingMethod(null);
    }
  }

  async function handleOAuthSignIn(provider: Provider) {
    setMessage("");

    const config = getSupabaseConfig();
    if (!config) {
      showError(
        "Authentication is not configured yet. Add the Supabase URL and public key to your environment.",
      );
      return;
    }

    setPendingMethod(provider);
    try {
      const supabase = createBrowserClient(config.url, config.key);
      const redirectTo = new URL(
        "/auth/callback",
        window.location.origin,
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo.toString(),
        },
      });

      if (error) {
        showError(error);
      }
    } catch (error) {
      showError(error);
    } finally {
      setPendingMethod(null);
    }
  }

  return (
    <div className="space-y-4">
      <form className="space-y-3" method="post" onSubmit={handleEmailAuth}>
        <div className="flex bg-black/10 h-8 text-md min-w-70 gap-1 pr-2 rounded-full p-1 text-black font-medium items-center">
          <span className="bg-black/10 rounded-full p-1  text-black font-medium items-center">
            <MdOutlineAlternateEmail />
          </span>
          <label className="sr-only" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="bg-transparent w-full border-none focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pendingMethod !== null}
          className="h-8 w-full rounded-full cursor-pointer bg-zinc-950 px-5 text-sm font-semibold  font-mono text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingMethod === "email"
            ? "Sending link..."
            : "Continue with email"}
        </button>
      </form>

      <div className="flex justify-center font-medium uppercase font-mono items-center gap-3 text-xs text-zinc-400">
        <span>or continue with</span>
      </div>

      <div className=" flex justify-center gap-2">
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={pendingMethod !== null}
          className="flex p-1 px-1 pr-4 items-center cursor-pointer duration-400  justify-center gap-1 rounded-full bg-black/10   text-xs font-semibold text-black transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="bg-black/10 rounded-full p-0.5  text-black font-medium items-center">
            <FcGoogle
              aria-hidden="true"
              fill="black"
              className="text-black"
              size={19}
            />
          </span>
          {pendingMethod === "google" ? "Connecting..." : "Google"}
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn("apple")}
          disabled={pendingMethod !== null}
          className="flex p-1 px-1 pr-4 items-center cursor-pointer duration-400  justify-center gap-1 rounded-full bg-black/10   text-xs font-semibold text-black transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="bg-black/10 rounded-full p-0.5  text-black font-medium items-center">
            <FaApple aria-hidden="true" className="text-black" size={19} />
          </span>

          {pendingMethod === "apple" ? "Connecting..." : "Apple"}
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn("facebook")}
          disabled={pendingMethod !== null}
          className="flex p-1 px-1 pr-4 items-center cursor-pointer duration-400  justify-center gap-1 rounded-full bg-black/10   text-xs font-semibold text-black transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="bg-black/10 rounded-full p-0.5  text-black font-medium items-center">
            <FaFacebookF
              aria-hidden="true"
              className="text-[#1877F2]"
              size={18}
            />
          </span>
          {pendingMethod === "facebook" ? "Connecting..." : "Facebook"}
        </button>
      </div>
      <p className="px-1 text-xs text-center font-medium leading-snug mute">
        By continuing, you agree to our terms and conditions.
      </p>
      {displayedMessage && (
        <p
          role={displayedIsError ? "alert" : "status"}
          aria-live={displayedIsError ? "assertive" : "polite"}
          className={`rounded-md leading-tight text-center px-3 py-2 text-xs font-medium leading-snug ${
            displayedIsError ? "  text-red-700" : "text-emerald-500"
          }`}
        >
          {displayedMessage}
        </p>
      )}
    </div>
  );
}
