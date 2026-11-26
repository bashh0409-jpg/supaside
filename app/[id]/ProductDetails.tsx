"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import Size from "../components/Size";
import ProductCard from "../components/ProductCard";
import { sampleProducts, sampleUkSizes } from "../lib/products";
import type { Product } from "../lib/products";
import { useCart } from "../lib/cart-context";
import Footer from "../components/Footer";

const formatPrice = (priceCents: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addItem, ready: cartReady } = useCart();
  const productImages = product.images ?? [
    { src: product.imageUrl, alt: product.name },
  ];
  const productGalleryRef = useRef<HTMLDivElement>(null);
  const relatedProductsRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeInfo, setActiveInfo] = useState<
    "details" | "shipping" | "returns"
  >("details");
  const footerNav =
    "text-xs text-black/50 uppercase  cursor-pointer hover:text-black duration-400 font-bold";
  const Label = "text-xs text-black/50 uppercase   duration-400 font-bold";
  const infoContent = {
    details: product.description,
    shipping:
      "Your order will be shipped from either Cape Town or Joburg, depending on where the closest stock is located. Estimates are displayed below, but check the delivery date in checkout for the most accurate date. Free delivery for orders over R950",
    returns:
      "For help with a return or exchange, contact our support team with your order details. Free exchange or return within 30 days",
  };
  const infoTabs = [
    { id: "details", label: "details" },
    { id: "shipping", label: "shipping" },
    { id: "returns", label: "returns" },
  ] as const;
  const scrollRelatedProducts = (direction: -1 | 1) => {
    const container = relatedProductsRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * container.clientWidth * 0.8,
      behavior: "smooth",
    });
  };
  const imageNumberStart = Math.min(
    Math.max(activeImageIndex - 1, 0),
    Math.max(productImages.length - 3, 0),
  );
  const compareAtPriceCents = product.compareAtPriceCents;
  const discountPercentage =
    compareAtPriceCents !== undefined &&
    compareAtPriceCents > product.priceCents
    ? Math.round(
        ((compareAtPriceCents - product.priceCents) / compareAtPriceCents) *
          100,
      )
    : 0;

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full min-h-screen  items-center">
        <div className="relative h-screen w-[50%]">
          <div
            id="product-image-gallery"
            ref={productGalleryRef}
            data-lenis-prevent
            role="region"
            aria-label="Product images"
            onScroll={() =>
              setActiveImageIndex(
                Math.round(
                  (productGalleryRef.current?.scrollLeft ?? 0) /
                    (productGalleryRef.current?.clientWidth || 1),
                ),
              )
            }
            className="flex h-full w-full snap-x snap-mandatory flex-nowrap touch-pan-x overflow-x-auto overflow-y-hidden bg-black/5"
          >
            {productImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="relative flex h-full w-full shrink-0 snap-start items-center justify-center"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="50vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div
            role="group"
            aria-label="Choose product image"
            className="absolute bottom-5 right-5 z-20 max-w-[104px] overflow-hidden rounded-full bg-black/45 p-1 backdrop-blur-sm"
          >
            <div
              className="flex w-max gap-1 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${imageNumberStart * 32}px)` }}
            >
              {productImages.map((image, index) => {
                const isVisible =
                  index >= imageNumberStart && index < imageNumberStart + 3;

                return (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    aria-hidden={!isVisible}
                    tabIndex={isVisible ? 0 : -1}
                    onClick={() =>
                      productGalleryRef.current?.scrollTo({
                        left:
                          index *
                          (productGalleryRef.current?.clientWidth ?? 0),
                        behavior: "smooth",
                      })
                    }
                    className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-semibold text-white transition-colors ${
                      activeImageIndex === index
                        ? "bg-white/35"
                        : "hover:bg-white/15"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
        <div className=" w-[50%] grid grid-cols-2 min-h-screen p-4">
          <div className="flex flex-col ">
            <p className=" text-3xl  tracking-tighter leading-none font-bold capitalize">
              {product.name}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {discountPercentage > 0 && compareAtPriceCents !== undefined && (
                <>
                  <p className="text-lg font-bold leading-none tracking-tighter line-through mute">
                    {formatPrice(compareAtPriceCents)}
                  </p>
                  <p className="text-lg font-bold uppercase leading-none tracking-tighter">
                    {discountPercentage}% off
                  </p>
                </>
              )}
              <p className="text-lg font-bold uppercase leading-none tracking-tighter">
                {formatPrice(product.priceCents)}
              </p>
            </div>
          </div>
          <div></div>

          <div className="">
            <div
              className="flex gap-4 font-semibold uppercase text-xs"
              role="group"
              aria-label="Product information"
            >
              {infoTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${footerNav} ${
                    activeInfo === tab.id ? "text-black underline" : ""
                  }`}
                  aria-pressed={activeInfo === tab.id}
                  onClick={() => setActiveInfo(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-4 font-semibold text-sm leading-tight">
              <p>{infoContent[activeInfo]}</p>
              <p className="hover:underline cursor-pointer hover:text-[#999]">
                More Details
              </p>
            </div>
          </div>
          <div></div>
          <div className="mt-4 flex flex-col gap-4 font-semibold text-md leading-tight">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className={Label}>brand</p>
                <span>{product.brand}</span>
              </div>
              <div className="flex capitalize flex-col">
                <p className={Label}>color</p>
                <span>{product.color}</span>
              </div>
              <div className="flex flex-col">
                <p className={Label}>style</p>
                <span>{product.style}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 font-semibold text-md leading-tight">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className={Label}>size (UK)</p>
                <div className="flex flex-wrap mt-2 gap-1 items-center">
                  {sampleUkSizes.map(({ size, available }) => (
                    <Size
                      key={size}
                      size={size}
                      available={available}
                      selected={selectedSize === size}
                      onSelect={setSelectedSize}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  type="button"
                  disabled={!selectedSize || !cartReady}
                  onClick={() => {
                    if (selectedSize) {
                      addItem(product.id, selectedSize);
                    }
                  }}
                  className="mt-2 w-fit border border-dashed p-2 text-center duration-300 enabled:cursor-pointer enabled:hover:border-black/20 enabled:hover:text-black/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add to cart
                </button>
                {!selectedSize && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Select a size to add this item to your cart.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <section
        aria-labelledby="related-products-heading"
        className=" mt-16 w-full p-4"
      >
        <div className="flex justify-between">
          <h2
            id="related-products-heading"
            className="text-3xl font-bold capitalize leading-none tracking-tighter"
          >
            Related products
          </h2>
          <div className="flex mt-4 gap-2">
            <button
              type="button"
              aria-label="Scroll related products left"
              className="rounded-full text-white bg-black/45 p-1.5 cursor-pointer duration-300 transition-colors hover:bg-black hover:text-white"
              onClick={() => scrollRelatedProducts(-1)}
            >
              <IoArrowBackOutline aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Scroll related products right"
              className="rounded-full text-white bg-black/45 p-1.5 cursor-pointer duration-300 transition-colors hover:bg-black hover:text-white"
              onClick={() => scrollRelatedProducts(1)}
            >
              <IoArrowForwardOutline aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          ref={relatedProductsRef}
          className="mt-4 flex w-full snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto overflow-y-hidden pb-4"
        >
          {sampleProducts
            .filter((relatedProduct) => relatedProduct.id !== product.id)
            .map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="w-[78%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-[24%] xl:w-[19%]"
            >
              <ProductCard product={relatedProduct} />
            </div>
            ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetails;
