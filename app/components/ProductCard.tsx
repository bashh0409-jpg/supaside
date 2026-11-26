"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri";
import type { Product } from "../lib/products";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (priceCents: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);

const ProductCard = ({ product }: ProductCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const productHref = `/${product.id}`;
  const discountPercentage =
    product.compareAtPriceCents &&
    product.compareAtPriceCents > product.priceCents
      ? Math.round(
          ((product.compareAtPriceCents - product.priceCents) /
            product.compareAtPriceCents) *
            100,
        )
      : 0;

  return (
    <article
      id={`product-${product.id}`}
      data-product-id={product.id}
      className="flex w-full cursor-pointer flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/10">
        <Link href={productHref} className="absolute inset-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
            className="object-cover"
          />
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 z-10 cursor-pointer "
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={isBookmarked}
          onClick={() => setIsBookmarked((bookmarked) => !bookmarked)}
        >
          {isBookmarked ? (
            <RiBookmarkFill size={16} className="text-black" />
          ) : (
            <RiBookmarkLine size={16} />
          )}
        </button>
      </div>
      <Link href={productHref} className="block">
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-xs font-semibold capitalize">
              {product.name}
            </p>
            {product.isBestSelling && (
              <p className="shrink-0 text-xs font-semibold capitalize text-red-400">
                Best selling
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {discountPercentage > 0 && product.compareAtPriceCents && (
              <p className="text-xs font-semibold line-through mute">
                {formatPrice(product.compareAtPriceCents)}
              </p>
            )}
            <p className="text-xs font-semibold">
              {formatPrice(product.priceCents)}
            </p>
          </div>
        </div>
        {discountPercentage > 0 && (
          <p className="mt-1 text-[10px]  font-semibold uppercase mute">
            {discountPercentage}% off
          </p>
        )}
      </Link>
    </article>
  );
};

export default ProductCard;
