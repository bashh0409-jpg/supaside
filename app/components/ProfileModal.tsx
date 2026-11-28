"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdOutlineClose } from "react-icons/md";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";
import { useDialogBehavior } from "../lib/useDialogBehavior";
import { PROFILE_TABS, type ProfileTab } from "./profile-modal/types";
import AccountTab from "./profile-modal/tabs/AccountTab";
import ShippingTab from "./profile-modal/tabs/ShippingTab";
import OrdersTab from "./profile-modal/tabs/OrdersTab";
import ReturnTab from "./profile-modal/tabs/ReturnTab";
import HelpCenterTab from "./profile-modal/tabs/HelpCenterTab";

gsap.registerPlugin(useGSAP);

type ProfileModalProps = {
  open: boolean;
  user: User;
  onClose: () => void;
};

function getTabId(tab: ProfileTab) {
  return `tab-${tab.toLowerCase().replace(/\s+/g, "-")}`;
}

function getPanelId(tab: ProfileTab) {
  return `${getTabId(tab)}-panel`;
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
  const [activeTab, setActiveTab] = useState<ProfileTab>("Account");
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

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
          setActiveTab("Account");
          setSignOutError(null);
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
        className="absolute inset-0 cursor-default bg-black/10 p-0 backdrop-blur-md"
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
        aria-labelledby="profile-dialog-title"
        data-lenis-prevent
        ref={panelRef}
        className="relative  z-10 h-[95vh] max-h-[95vh] w-full overflow-y-auto lg:overflow-y-hidden rounded-t-md bg-white px-4 pb-10 text-zinc-950 shadow-2xl sm:px-6"
      >
        <h1 id="profile-dialog-title" className="sr-only">
          Profile
        </h1>
        <div className="flex w-full items-center justify-between gap-4 ">
          <div
            role="tablist"
            aria-label="Profile sections"
            className="flex min-w-0 items-center justify-start gap-4 overflow-x-auto capitalize"
          >
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={getTabId(tab)}
                aria-selected={activeTab === tab}
                aria-controls={getPanelId(tab)}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 cursor-pointer whitespace-nowrap text-sm font-semibold hover:text-[#999] ${
                  activeTab === tab ? "mute" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="shrink-0 text-sm  absolute left-1/2 -translate-x-1/2 font-semibold">
            <img src="/logo.jpg" alt="Logo" className="ml-2 h-6 w-auto" />
          </span>
          <div className="flex items-center p-2 sm:gap-8">
            <span className="text-sm font-semibold">Settings</span>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOutPending}
              className="cursor-pointer whitespace-nowrap text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
            >
              {signOutPending ? "Signing Out…" : "Sign Out"}
            </button>
          </div>
        </div>

        {signOutError && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {signOutError}
          </p>
        )}

        {PROFILE_TABS.map((tab) => (
          <div
            key={tab}
            role="tabpanel"
            id={getPanelId(tab)}
            aria-labelledby={getTabId(tab)}
            hidden={activeTab !== tab}
            className="mt-20 flex w-full flex-col gap-2"
          >
            {tab === "Account" && <AccountTab user={user} />}
            {tab === "Shipping" && <ShippingTab userId={user.id} />}
            {tab === "Orders" && <OrdersTab />}
            {tab === "Return" && <ReturnTab />}
            {tab === "Help Center" && <HelpCenterTab />}
          </div>
        ))}
      </section>
    </div>
  );
}
