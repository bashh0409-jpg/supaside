"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";
import PasskeyDetails from "./PasskeyDetails";
import ShippingDetails from "./ShippingDetails";

type AccountTabProps = {
  user: User;
};

function getMetadataString(user: User, key: string) {
  const value = user.user_metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

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

export default function AccountTab({ user }: AccountTabProps) {
  const fallbackName =
    getMetadataString(user, "full_name") ??
    getMetadataString(user, "name") ??
    user.email?.split("@")[0] ??
    "Not provided";
  const fallbackPhone =
    user.phone ?? getMetadataString(user, "phone") ?? "Not provided";
  const [profile, setProfile] = useState({
    name: fallbackName,
    phone: fallbackPhone,
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const email = user.email ?? "Not provided";
  const providerValue =
    typeof user.app_metadata.provider === "string"
      ? user.app_metadata.provider
      : "Unknown";
  const provider =
    providerValue === "x"
      ? "X"
      : providerValue.charAt(0).toUpperCase() + providerValue.slice(1);
  const createdAt = formatDate(user.created_at);
  const lastSignIn = formatDate(user.last_sign_in_at);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) {
          throw new Error("Supabase is not configured");
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();
        if (error) {
          throw error;
        }

        if (active) {
          setProfile({
            name:
              typeof data?.full_name === "string" && data.full_name.trim()
                ? data.full_name.trim()
                : fallbackName,
            phone:
              typeof data?.phone === "string" && data.phone.trim()
                ? data.phone.trim()
                : fallbackPhone,
          });
          setProfileLoadError(null);
        }
      } catch (error) {
        console.error("Unable to load account profile details:", error);
        if (active) {
          setProfileLoadError(
            "Saved profile details are unavailable; showing sign-in details.",
          );
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [fallbackName, fallbackPhone, user.id]);

  const details = [
    {
      label: "Name",
      value: profileLoading
        ? "Loading…"
        : `${profile.name}${
            profileLoadError ? " (using sign-in details)" : ""
          }`,
    },
    { label: "Email", value: email },
    {
      label: "Phone",
      value: profileLoading
        ? "Loading…"
        : `${profile.phone}${
            profileLoadError ? " (using sign-in details)" : ""
          }`,
    },
    { label: "Sign-in method", value: provider },
    { label: "Joined", value: createdAt },
    { label: "Last sign-in", value: lastSignIn },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      <figure>
        <img
          src="/logo.jpg"
          className="w-50 aspect-[4/5] object-cover"
          alt="Profile Image"
        />
      </figure>
      <div className="col-span-2 w-full">
        <section>
          <h2 className="mb-3 text-sm  hidden font-semibold">Personal details</h2>
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Your personal details</caption>
            <tbody>
              {details.map((detail) => (
                <tr
                  className="border-b border-gray-200"
                  key={detail.label}
                >
                  <th
                    scope="row"
                    className="w-1/3 pb-3 pt-1 pr-4 font-semibold"
                  >
                    {detail.label}
                  </th>
                  <td className="pb-3 pt-1 font-semibold">: {detail.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="mt-12">
          <ShippingDetails userId={user.id} showControls={false} />
        </div>
        <div className="mt-12">
          <PasskeyDetails />
        </div>
      </div>
    </div>
  );
}
