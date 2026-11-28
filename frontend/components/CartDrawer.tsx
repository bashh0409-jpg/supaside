"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdOutlineClose } from "react-icons/md";
import CartItem from "./CartItem";
import { useCart } from "../lib/cart-context";
import { sampleProducts, sampleUkSizes } from "../lib/products";
import { useDialogBehavior } from "../lib/useDialogBehavior";

gsap.registerPlugin(useGSAP);

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const focusableSelector =
  'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    itemCount,
    lines,
    removeItem,
    storageError,
    totalCents,
    updateQuantity,
  } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const drawer = drawerRef.current;
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      if (!drawer || !backdrop || !panel) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = reduceMotion ? 0 : 0.75;
      gsap.set(panel, { x: 24 });

      const timeline = gsap.timeline({
        paused: true,
        onReverseComplete: () => gsap.set(drawer, { autoAlpha: 0 }),
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
        {
          clipPath: "inset(0px 0px 0px 0%)",
          duration,
          ease: "power4.out",
          x: 0,
        },
        0,
      );
      timelineRef.current = timeline;
    },
    { scope: drawerRef },
  );

  useEffect(() => {
    const drawer = drawerRef.current;
    if (open) {
      gsap.set(drawer, { autoAlpha: 1 });
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useDialogBehavior(open, onClose, closeButtonRef);

  return (
    <div
      ref={drawerRef}
      className="invisible fixed inset-0 z-[1100]"
      aria-hidden={!open}
    >
      <button
        ref={backdropRef}
        type="button"
        tabIndex={-1}
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 opacity-0"
      />
      <aside
        ref={panelRef}
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        data-lenis-prevent
        style={{ clipPath: "inset(0px 0px 0px 100%)" }}
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden bg-white px-6 pb-6 pt-5 text-zinc-950 shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between">
          <p
            id="cart-drawer-title"
            className="cursor-pointer text-sm font-medium"
          >
            Shopping Cart
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full cursor-pointer p-1 text-xl text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            <MdOutlineClose aria-hidden="true" />
          </button>
        </header>

        {storageError && (
          <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-xs text-red-700">
            {storageError}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <p className="mt-5 flex font-mono uppercase mute cursor-pointer items-center justify-center rounded-lg p-20 text-xs font-medium">
              Your cart is empty
            </p>
          ) : (
            lines.map((line) => {
              const product = sampleProducts.find(
                (item) => item.id === line.productId,
              );
              if (!product) {
                throw new Error(
                  `Cart contains unknown product "${line.productId}"`,
                );
              }

              return (
                <CartItem
                  key={`${line.productId}-${line.size}`}
                  product={product}
                  size={line.size}
                  quantity={line.quantity}
                  isAvailable={sampleUkSizes.some(
                    (option) => option.size === line.size && option.available,
                  )}
                  onQuantityChange={(quantity) =>
                    updateQuantity(line.productId, line.size, quantity)
                  }
                  onRemove={() => removeItem(line.productId, line.size)}
                />
              );
            })
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-2">
          <div className="flex w-full justify-between text-xs font-semibold capitalize uppercas mute">
            <p>Total: </p>
            <p>{Math.round(totalCents / 100)} ZAR</p>
            <p>Items:</p>
            <p>{itemCount}</p>
          </div>
          <button
            type="button"
            className="flex w-full cursor-pointer justify-between bg-black p-2 px-3 text-xs font-semibold capitalize uppercas mute text-white"
          >
            <span>Checkout</span>
            <span>{Math.round(totalCents / 100)} ZAR</span>
          </button>
        </footer>
      </aside>
    </div>
  );
}
