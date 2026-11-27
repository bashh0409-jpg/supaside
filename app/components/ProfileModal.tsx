"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdOutlineClose } from "react-icons/md";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";
import { useDialogBehavior } from "../lib/useDialogBehavior";

gsap.registerPlugin(useGSAP);

const TABS = [
  "Account Info",
  "Shipping",
  "Orders",
  "Returns",
  "Help Center",
] as const;
type Tab = (typeof TABS)[number];

type ProfileModalProps = {
  open: boolean;
  user: User;
  onClose: () => void;
};

type ProfileForm = {
  name: string;
  phone: string;
};

function getDeleteError(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }
  return "Unable to delete your account. Please try again.";
}

function getDisplayName(user: User) {
  const name = [user.user_metadata.full_name, user.user_metadata.name].find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
  return name ?? user.email?.split("@")[0] ?? "Your account";
}

function getFormFromUser(user: User): ProfileForm {
  const fullName = user.user_metadata.full_name;
  const phone = user.user_metadata.phone;
  return {
    name:
      typeof fullName === "string" && fullName.trim()
        ? fullName
        : getDisplayName(user),
    phone: typeof phone === "string" ? phone : "",
  };
}

function validate(form: ProfileForm): string | null {
  if (form.name.trim().length < 2) {
    return "Please enter your name.";
  }
  if (form.phone.trim() && !/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) {
    return "Enter a valid phone number, e.g. +27 82 123 4567.";
  }
  return null;
}

type ProfileInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "onBlur" | "onChange" | "onFocus" | "value"
> & {
  isDirty?: boolean;
  label: string;
  value: string;
  onValueChange?: (value: string) => void;
};

function ProfileInput({
  id,
  label,
  value,
  isDirty = false,
  onValueChange,
  className = "mt-2 w-full border-b border-gray-200 py-2 font-medium outline-none transition-colors focus:border-black",
  ...inputProps
}: ProfileInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textColor =
    !inputProps.readOnly && (isFocused || isDirty) ? "text-black" : "mute";

  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold uppercase">{label}</span>
      <input
        {...inputProps}
        id={id}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={
          onValueChange
            ? (event) => onValueChange(event.target.value)
            : undefined
        }
        className={`${textColor} ${className}`}
      />
    </label>
  );
}

export default function ProfileModal({
  open,
  user,
  onClose,
}: ProfileModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Account Info");
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const [saved, setSaved] = useState<ProfileForm>(() => getFormFromUser(user));
  const [form, setForm] = useState<ProfileForm>(() => getFormFromUser(user));
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [savePending, setSavePending] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isDirty = form.name !== saved.name || form.phone !== saved.phone;

  const metadataKey = JSON.stringify([
    user.id,
    user.user_metadata.full_name,
    user.user_metadata.name,
    user.user_metadata.phone,
  ]);
  useEffect(() => {
    let active = true;
    const fallback = getFormFromUser(user);

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

        const next: ProfileForm = {
          name:
            typeof data?.full_name === "string" && data.full_name.trim()
              ? data.full_name
              : fallback.name,
          phone:
            typeof data?.phone === "string" ? data.phone : fallback.phone,
        };
        if (active) {
          setSaved(next);
          setForm(next);
          setProfileLoadError(null);
        }
      } catch (error) {
        console.error("Unable to load profile from the database:", error);
        if (active) {
          setSaved(fallback);
          setForm(fallback);
          setProfileLoadError("Unable to load your saved profile.");
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
  }, [metadataKey, user]);

  function updateField<K extends keyof ProfileForm>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setProfileLoadError(null);

    if (profileLoading) {
      return;
    }

    const validationError = validate(form);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSavePending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setSaveError("Saving is unavailable. Please try again later.");
        return;
      }

      const next: ProfileForm = {
        name: form.name.trim(),
        phone: form.phone.trim(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: next.name,
            phone: next.phone,
          },
          { onConflict: "id" },
        )
        .select("full_name, phone")
        .single();
      if (error) {
        throw error;
      }

      const confirmed: ProfileForm = {
        name: data.full_name ?? next.name,
        phone: data.phone ?? next.phone,
      };

      setSaved(confirmed);
      setForm(confirmed);
      setSaveSuccess(true);
      router.refresh();
    } catch (error) {
      console.error("Unable to update profile:", error);
      setSaveError("Unable to save your changes. Please try again.");
    } finally {
      setSavePending(false);
    }
  }

  async function handleSignOut() {
    setSignOutError(null);
    setSignOutPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setSignOutError("Sign out is unavailable. Please try again later.");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      onClose();
    } catch (error) {
      console.error("Unable to sign out:", error);
      setSignOutError("Unable to sign out. Please try again.");
    } finally {
      setSignOutPending(false);
    }
  }

  async function handleDeleteAccount() {
    if (deletePending) {
      return;
    }

    setDeleteError(null);
    const nextProgress = deleteProgress + 1;
    setDeleteProgress(nextProgress);
    if (nextProgress < 5) {
      return;
    }

    setDeletePending(true);
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(getDeleteError(payload));
      }

      try {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          const { error } = await supabase.auth.signOut({ scope: "local" });
          if (error) {
            console.error(
              "Account was deleted, but local sign-out failed:",
              error,
            );
          }
        }
      } catch (error) {
        console.error("Account was deleted, but local sign-out failed:", error);
      }

      window.location.replace("/login?account_deleted=1");
    } catch (error) {
      console.error("Unable to delete account:", error);
      setDeleteProgress(0);
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete your account. Please try again.",
      );
    } finally {
      setDeletePending(false);
    }
  }

  useGSAP(
    () => {
      const modal = modalRef.current;
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      const closeButton = closeButtonRef.current;
      if (!modal || !backdrop || !panel || !closeButton) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = reduceMotion ? 0 : 0.7;
      gsap.set(modal, { autoAlpha: 0 });
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(panel, { autoAlpha: 0, yPercent: 100 });
      gsap.set(closeButton, { autoAlpha: 0 });

      const timeline = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(modal, { autoAlpha: 0 });
          setActiveTab("Account Info");
          setSignOutError(null);
          setSaveError(null);
          setSaveSuccess(false);
          setDeleteProgress(0);
          setDeleteError(null);
        },
      });
      timeline.to(
        backdrop,
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0 : 0.35,
          ease: "power1.out",
        },
        0,
      );
      timeline.to(
        panel,
        { autoAlpha: 1, duration, ease: "power4.out", yPercent: 0 },
        0,
      );
      timeline.to(
        closeButton,
        { autoAlpha: 1, duration: reduceMotion ? 0 : 0.3 },
        0.1,
      );
      timelineRef.current = timeline;
    },
    { scope: modalRef },
  );

  useEffect(() => {
    const modal = modalRef.current;
    if (open) {
      gsap.set(modal, { autoAlpha: 1 });
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, [open]);

  useDialogBehavior(open, onClose, closeButtonRef);

  return (
    <div
      ref={modalRef}
      aria-hidden={!open}
      className="invisible fixed inset-0 z-[1200] flex items-end justify-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        ref={backdropRef}
        type="button"
        tabIndex={-1}
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 p-0 backdrop-blur-md"
      />
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close profile"
        className="absolute bottom-8 right-8 z-[100] flex cursor-pointer items-center justify-center rounded-lg bg-black p-4 text-2xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <MdOutlineClose aria-hidden="true" />
      </button>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        data-lenis-prevent
        ref={panelRef}
        className="relative z-10 h-[95vh] max-h-[95vh] w-full overflow-y-auto rounded-t-md bg-white px-4 pb-10 text-zinc-950 shadow-2xl sm:px-6"
      >
        <div className="flex w-full items-center justify-between">
          <div
            role="tablist"
            aria-label="Account sections"
            className="flex items-center gap-6 capitalize"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`tab-${tab}`}
                aria-selected={activeTab === tab}
                aria-controls="profile-tabpanel"
                onClick={() => {
                  if (tab !== "Account Info") {
                    setDeleteProgress(0);
                    setDeleteError(null);
                  }
                  setActiveTab(tab);
                }}
                className={`cursor-pointer text-sm font-semibold hover:text-[#999] ${
                  activeTab === tab ? "mute" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span
            id="profile-modal-title"
            className="text-sm flex left-1/2 -translate-x-1/2 font-semibold"
          >
            SS
          </span>

          <div className="flex items-center gap-8 p-2">
            <span className="text-sm font-semibold">{user.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOutPending}
              className="cursor-pointer text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
            >
              {signOutPending ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>

        {signOutError && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {signOutError}
          </p>
        )}

        <div
          role="tabpanel"
          id="profile-tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="mt-20 flex w-full flex-col gap-2"
        >
          {activeTab === "Account Info" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="grid grid-cols-2 ">
                <p className="text-sm font-semibold">Update {activeTab}</p>
                <span />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <form
                  onSubmit={handleSave}
                  noValidate
                  className="flex flex-col col-span-2 gap-4"
                >
                  <ProfileInput
                    id="profile-name"
                    label="Name"
                    type="text"
                    value={form.name}
                    isDirty={form.name !== saved.name}
                    onValueChange={(value) => updateField("name", value)}
                    disabled={profileLoading}
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                  <ProfileInput
                    id="profile-email"
                    label="Email"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className="mt-2 w-full py-2 cursor-not-allowed border-b  focus:ring-0 focus:outline-none border-gray-200 font-medium"
                  />
                  <ProfileInput
                    id="profile-phone"
                    label="Contact"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    isDirty={form.phone !== saved.phone}
                    onValueChange={(value) => updateField("phone", value)}
                    disabled={profileLoading}
                    autoComplete="tel"
                    placeholder="+27 82 123 4567"
                    maxLength={20}
                  />

                  {profileLoading && (
                    <p role="status" className="text-sm text-zinc-500">
                      Loading saved profile…
                    </p>
                  )}
                  {profileLoadError && (
                    <p role="alert" className="text-sm text-red-600">
                      {profileLoadError}
                    </p>
                  )}
                  {saveError && (
                    <p role="alert" className="text-sm text-red-600">
                      {saveError}
                    </p>
                  )}
                  {saveSuccess && (
                    <p
                      role="status"
                      className="text-sm font-medium text-green-600"
                    >
                      Your details have been updated.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!isDirty || savePending || profileLoading}
                    className=" w-full border border-dashed p-2 text-center text-xs font-semibold uppercase duration-300 disabled:text-[#999] enabled:cursor-pointer enabled:hover:border-black/20 enabled:hover:text-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {profileLoading
                      ? "Loading profile…"
                      : savePending
                        ? "Saving…"
                        : "Save changes"}
                  </button>
                </form>
                <div className="flex flex-col gap-2">
                  <span className="mute mb-4 text-sm font-semibold uppercase">
                    personal information
                  </span>
                  <span className="text-sm text-justify font-semibold">
                    We only keep the information necessary to help make your
                    experience on Supaside easier and more enjoyable. We can
                    send you a copy of all the information we hold.
                  </span>

                  <button
                    type="button"
                    className="mute mt-2 border border-dashed p-2 text-center text-xs font-semibold uppercase duration-300 enabled:cursor-pointer enabled:hover:border-black/20 enabled:hover:text-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Download data
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="mute mb-4 text-sm font-semibold uppercase">
                    danger zone
                  </span>
                  <span className="text-sm text-justify font-semibold">
                    Due to the Consumer Protection Act, where there are orders
                    placed less than 6 months prior to the date of deletion
                    request, the deletion request will only be concluded once
                    the 6 months has lapsed
                  </span>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deletePending}
                    aria-describedby="delete-account-help"
                    className="relative isolate mt-2 w-full overflow-hidden border border-dashed p-2 text-center text-xs font-semibold uppercase duration-300 enabled:cursor-pointer disabled:cursor-wait disabled:opacity-60"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 z-0 bg-red-600 transition-[width] duration-200 ease-out"
                      style={{ width: `${deleteProgress * 20}%` }}
                    />
                    <span className="relative z-10">
                      {deletePending
                        ? "Deleting account…"
                        : deleteProgress > 0
                          ? `tap again`
                          : "Delete account"}
                    </span>
                  </button>
                  
                  {deleteError && (
                    <p role="alert" className="text-sm font-medium text-red-600">
                      {deleteError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "Orders" && (
            <p className="text-sm">Your orders will show here.</p>
          )}
          {activeTab === "Returns" && (
            <p className="text-sm">Your returns will show here.</p>
          )}
          {activeTab === "Shipping" && (
            <p className="text-sm">Your shipping information will show here.</p>
          )}
          {activeTab === "Help Center" && (
            <p className="text-sm">Help center content will show here.</p>
          )}
        </div>
      </section>
    </div>
  );
}
