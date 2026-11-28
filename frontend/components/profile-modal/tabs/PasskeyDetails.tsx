"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";

type Passkey = {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export default function PasskeyDetails() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPasskeys() {
      try {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) {
          throw new Error("Supabase is not configured");
        }

        const { data, error } = await supabase.auth.passkey.list();
        if (error) {
          throw error;
        }

        if (active) {
          setPasskeys(data ?? []);
        }
      } catch (error) {
        console.error("Unable to load passkeys:", error);
        if (active) {
          setErrorMessage("Unable to load saved passkeys.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPasskeys();
    return () => {
      active = false;
    };
  }, []);

  async function addPasskey() {
    setErrorMessage(null);
    setSuccessMessage(null);
    setRegistering(true);

    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { data, error } = await supabase.auth.registerPasskey();
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("Passkey registration did not return a passkey.");
      }

      setPasskeys((current) => [
        data,
        ...current.filter((passkey) => passkey.id !== data.id),
      ]);
      setSuccessMessage("Passkey added.");
    } catch (error) {
      console.error("Unable to add passkey:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to add passkey. Please try again.",
      );
    } finally {
      setRegistering(false);
    }
  }

  return (
    <section>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-xs">
          <caption className="sr-only">Your saved passkeys</caption>
          <thead>
            <tr className="mute border-b border-gray-200 text-xs uppercase">
              {["Passkey", "Added", "Last used"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="pb-3 pr-4 font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-4 font-semibold text-gray-500">
                  Loading passkeys…
                </td>
              </tr>
            ) : passkeys.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 font-semibold mute">
                  No passkeys saved.
                </td>
              </tr>
            ) : (
              passkeys.map((passkey) => (
                <tr
                  key={passkey.id}
                  className="border-b border-gray-200 font-semibold"
                >
                  <td className="py-3 pr-4">
                    {passkey.friendly_name?.trim() || "Passkey"}
                  </td>
                  <td className="py-3 pr-4">
                    {formatDate(passkey.created_at)}
                  </td>
                  <td className="py-3 pr-4">
                    {formatDate(passkey.last_used_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm hidden font-semibold">Passkeys</h2>
        <button
          type="button"
          onClick={() => void addPasskey()}
          disabled={loading || registering}
          className="cursor-pointer border border-dashed p-1 px-2 text-xs font-semibold hover:opacity-60 disabled:cursor-wait disabled:opacity-60"
        >
          {registering ? "Adding…" : "Add Passkey"}
        </button>
      </div>
      {errorMessage && (
        <p role="alert" className="mb-2 text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className="mb-2 text-xs font-medium">
          {successMessage}
        </p>
      )}
    </section>
  );
}
