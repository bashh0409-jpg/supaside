"use client";

import { useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdOutlineClose } from "react-icons/md";

gsap.registerPlugin(useGSAP);

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
        onReverseComplete: () => gsap.set(modal, { autoAlpha: 0 }),
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
        className="relative z-10 h-[93vh] max-h-[93vh] w-full overflow-y-auto rounded-t-lg bg-white px-6 pb-10 text-zinc-950 shadow-2xl sm:px-8"
      >
      </section>
    </div>
  );
}
