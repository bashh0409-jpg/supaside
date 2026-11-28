import React from "react";
import Navbar from "@/frontend/components/Navbar";
import ProductCard from "@/frontend/components/ProductCard";
import Footer from "@/frontend/components/Footer";
import HeroVideo from "@/frontend/components/HeroVideo";
import { IoArrowUpOutline } from "react-icons/io5";
import { sampleProducts } from "@/frontend/lib/products";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        <HeroVideo playbackId={process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID} />
        
        <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
        <Link
          href="/shop"
          className="relative z-10 w-fit cursor-pointer rounded-full bg-white px-4 p-2 text-sm font-semibold capitalize"
        >
          Shop now
        </Link>
      </section>
      <div className="h-screen w-full"></div>
      <div className="min-h-screen w-full grid p-4 gap-3 grid-cols-5">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button className="fixed hidden bottom-4 text-white right-4 z-10 rounded-full bg-[#999] p-2">
        <IoArrowUpOutline />
      </button>
      <div className="h-screen w-full "></div>
      <Footer />
    </div>
  );
};

export default page;
