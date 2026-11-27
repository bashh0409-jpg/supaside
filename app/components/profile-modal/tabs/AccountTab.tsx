"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";

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
      value: profileLoading ? "Loading…" : profile.name,
    },
    { label: "Email", value: email },
    {
      label: "Phone",
      value: profileLoading ? "Loading…" : profile.phone,
    },
    { label: "Sign-in method", value: provider },
    { label: "Joined", value: createdAt },
    { label: "Last sign-in", value: lastSignIn },
  ];

  return (
    <div className="grid grid-cols-3  gap-4">
      <span>
        <img
          src="/logo.jpg"
          className="w-50 aspect-[4/5] object-cover"
          alt="Profile Image"
        />
      </span>
      <div className="col-span-2 grid grid-cols-2 w-full ">
        {details.map((detail) => (
          <div className="flex flex-col" key={detail.label}>
            <p className="text-sm font-semibold">
              {detail.label}: {detail.value}
              {profileLoadError &&
                (detail.label === "Name" || detail.label === "Phone") &&
                " (using sign-in details)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
