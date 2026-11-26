"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { getSupabaseConfig } from "../lib/supabase/config";
import { useCart } from "../lib/cart-context";
import SearchModal from "./SearchModal";

function getAvatarUrl(user: User) {
  const image = [
    user.user_metadata.avatar_url,
    user.user_metadata.picture,
  ].find((value): value is string => typeof value === "string");
  if (!image) {
    return null;
  }

  try {
    const url = new URL(image);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const config = getSupabaseConfig();
  const supabaseUrl = config?.url;
  const supabaseKey = config?.key;
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authReady, setAuthReady] = useState(
    () => !supabaseUrl || !supabaseKey,
  );
  const { itemCount, open: cartOpen, openCart } = useCart();

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) {
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabaseUrl, supabaseKey]);

  const avatarUrl = user ? getAvatarUrl(user) : null;
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <div className="fixed top-0 z-999999 left-0 capitalize flex px-2 gap-2 w-full justify-between items-center p-1 text-white mix-blend-difference">
        <div className="flex gap-8 items-center p-2">
          <div className="text-sm cursor-pointer font-semibold">Supaside</div>
          <p className="text-sm cursor-pointer font-semibold">
            Shop <span className="text-[10px] font-bold">[ 2430 ]</span>
          </p>
          <p className="text-sm cursor-pointer font-semibold">Men</p>
          <p className="text-sm cursor-pointer font-semibold">Woman</p>
          <p className="hidden cursor-pointer text-sm font-semibold">Sports</p>
        </div>
        <div className="flex items-center gap-4 p-2 sm:gap-8">
          <button
            type="button"
            onClick={openCart}
            aria-controls="cart-drawer"
            aria-expanded={cartOpen}
            className="cursor-pointer text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            Cart <span className="text-[10px] font-bold">[ {itemCount} ]</span>
          </button>
          {authReady &&
            (user ? (
              <span aria-hidden="true" className="h-6 w-6 shrink-0" />
            ) : (
              <Link href="/login" className="text-sm font-semibold capitalize">
                Sign in
              </Link>
            ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label="Open product search"
        aria-haspopup="dialog"
        aria-expanded={searchOpen}
        className="fixed top-2 left-1/2 z-1000 flex min-w-70 -translate-x-1/2 cursor-text items-center gap-1 rounded-full bg-zinc-200 p-1 pr-2 text-left text-sm font-medium text-black"
      >
        <span className="items-center rounded-lg bg-black/10 p-1 font-medium text-black">
          <BiSearch />
        </span>
        <span className="text-black/55">Search items...</span>
      </button>
      <SearchModal open={searchOpen} onClose={closeSearch} />
      {authReady && user && (
        <span
          aria-hidden="true"
          className="fixed top-3 right-2 z-1001 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black/10 text-xs font-semibold text-black"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            user.email?.trim().charAt(0).toUpperCase() || "U"
          )}
        </span>
      )}
    </>
  );
}
