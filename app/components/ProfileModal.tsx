"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdOutlineClose } from "react-icons/md";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "../lib/supabase/config";

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

function getDisplayName(user: User) {
  const name = [user.user_metadata.full_name, user.user_metadata.name].find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
  return name ?? user.email?.split("@")[0] ?? "Your account";
}

export default function ProfileModal({
  open,
  user,
  onClose,
}: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Account Info");
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSignOutError(null);
    const config = getSupabaseConfig();
    if (!config) {
      setSignOutError("Sign out is unavailable. Please try again later.");
      return;
    }

    setSignOutPending(true);
    try {
      const supabase = createBrowserClient(config.url, config.key);
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

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousFocus =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose, open]);

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
        className="absolute bottom-8 justify-center right-8 z-100 flex p-4  cursor-pointer items-center rounded-lg bg-black text-2xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
        <div className="flex w-full justify-between items-center">
          <div role="tablist" className="flex gap-6 capitalize items-center">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm cursor-pointer underline-offset-2 hover:underline hover:text-[#999] font-semibold ${
                  activeTab === tab ? "underline mute" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="text-sm font-semibold">Supaside</button>

          <div className="flex gap-8 items-center p-2">
            <button className="text-sm cursor-pointer font-semibold">
              {user?.email}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOutPending}
              className="text-sm cursor-pointer font-semibold disabled:cursor-wait disabled:opacity-60"
            >
              Sign Out
            </button>
          </div>
        </div>

        {signOutError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {signOutError}
          </p>
        )}

        <div role="tabpanel" className="flex w-full mt-20 flex-col gap-2">
          <p className="text-sm font-semibold">
            {activeTab}
          </p>

          {activeTab === "Account Info" && (
            <span className="text-sm">Hello, {getDisplayName(user)}</span>
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
