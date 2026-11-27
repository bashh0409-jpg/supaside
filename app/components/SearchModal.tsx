"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { BiSearch } from "react-icons/bi";
import { MdOutlineTrendingUp, MdOutlineBackspace } from "react-icons/md";
import { CgAdidas } from "react-icons/cg";
import { SiNike, SiNewbalance } from "react-icons/si";
import { sampleProducts } from "../lib/products";
import { useDialogBehavior } from "../lib/useDialogBehavior";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

type Brand = {
  id: string;
  label: string;
  Icon: IconType;
};

const PAGE_SIZE = 20;

const brandIcons: Record<string, IconType> = {
  adidas: CgAdidas,
  nike: SiNike,
  "new balance": SiNewbalance,
};

const BRANDS: Brand[] = Array.from(
  new Map(
    sampleProducts.map((product) => {
      const id = product.brand.toLowerCase();
      return [
        id,
        { id, label: product.brand, Icon: brandIcons[id] ?? BiSearch },
      ];
    }),
  ).values(),
);

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [bestSelling, setBestSelling] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    setQuery("");
    setActiveBrand(null);
    setBestSelling(false);
    setVisibleCount(PAGE_SIZE);
    onClose();
  }, [onClose]);

  useDialogBehavior(open, closeModal, inputRef);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = sampleProducts.filter((product) => {
      const matchesBrand =
        !activeBrand || product.brand.toLowerCase() === activeBrand;
      const searchableText = [
        product.name,
        product.brand,
        product.color,
        product.style,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !term || searchableText.includes(term);
      return matchesBrand && matchesQuery;
    });
    if (bestSelling) {
      list = [...list].sort(
        (a, b) => Number(b.isBestSelling) - Number(a.isBestSelling),
      );
    }
    return list;
  }, [query, activeBrand, bestSelling]);

  const visibleResults = results.slice(0, visibleCount);

  // Best selling and brand filters are mutually exclusive
  const toggleBestSelling = () => {
    setBestSelling((prev) => !prev);
    setActiveBrand(null);
    setVisibleCount(PAGE_SIZE);
  };

  const toggleBrand = (id: string) => {
    setActiveBrand((prev) => (prev === id ? null : id));
    setBestSelling(false);
    setVisibleCount(PAGE_SIZE);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/5 p-4 backdrop-blur-md"
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-search-title"
        className="flex h-[min(430px,82vh)] w-full max-w-[750px] flex-col overflow-hidden  rounded-3xl bg-[#262626] text-white shadow-2xl p-6"
      >
        <h2 id="product-search-title" className="sr-only">
          Search products
        </h2>

        {/* Search input */}
        <div className="flex w-full items-center gap-2">
          <span className="bg-white/10 p-2 rounded-lg">
            {" "}
            <BiSearch size={24} aria-hidden="true" />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full text-lg font-medium text-white placeholder:text-[#999] focus:outline-none bg-transparent"
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Clear search"
              className="cursor-pointer rounded p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <MdOutlineBackspace size={18} />
            </button>
          )}
        </div>

        <div
          ref={resultsContainerRef}
          onScroll={(event) => {
            const container = event.currentTarget;
            const nearBottom =
              container.scrollTop + container.clientHeight >=
              container.scrollHeight - 100;

            if (nearBottom && visibleCount < results.length) {
              setVisibleCount((count) =>
                Math.min(count + PAGE_SIZE, results.length),
              );
            }
          }}
          className="mt-6 min-h-0 flex-1 overscroll-contain overflow-y-auto pr-1"
        >
          {/* Quick filters */}
          <div className="flex gap-2 text-left">
            <button
              type="button"
              aria-pressed={bestSelling}
              aria-label="Best selling"
              title="Best selling"
              onClick={toggleBestSelling}
              className={`flex cursor-pointer items-center gap-2 rounded-full p-2 px-4 text-left font-mono text-xs capitalize transition-colors hover:bg-white/10 ${
                bestSelling ? "bg-white/10" : ""
              }`}
            >
              <MdOutlineTrendingUp size={22} />
            </button>
            {BRANDS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={activeBrand === id}
                aria-label={label}
                title={label}
                onClick={() => toggleBrand(id)}
                className={`flex cursor-pointer items-center gap-2 rounded-full p-2 px-4 text-left font-mono text-xs capitalize transition-colors hover:bg-white/10 ${
                  activeBrand === id ? "bg-white/10" : ""
                }`}
              >
                <Icon size={22} />
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="mt-8 font-medium">
            {results.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center text-center text-sm font-semibold">
                <p className="mt-1 font-semibold text-xs">
                  No products found{query ? ` for "${query}"` : ""}.
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-3 gap-3">
                {visibleResults.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/${product.id}`}
                      onClick={closeModal}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 p-2 transition-colors hover:bg-white/20"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="truncate text-md font-semibold capitalize text-white">
                          {product.name}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
