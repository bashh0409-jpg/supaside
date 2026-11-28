import { Suspense } from "react";
import ProductById from "@/frontend/products/ProductById";
import { sampleProducts } from "@/frontend/lib/products";
import Navbar from "@/frontend/components/Navbar";

export function generateStaticParams() {
  return sampleProducts.map((product) => ({ id: product.id }));
}

function ProductDetailsFallback() {
  return (
    <main
      aria-label="Loading product details"
      aria-busy="true"
      className="w-full"
    >
      <Navbar />
      <div className="flex min-h-screen w-full">
        <div className="min-h-screen w-1/2 animate-pulse bg-black/5" />
        <div className="grid min-h-screen w-1/2 grid-cols-2 gap-6 p-4">
          <div className="col-span-2 space-y-4">
            <div className="h-9 w-3/4 animate-pulse bg-black/10" />
            <div className="h-5 w-1/3 animate-pulse bg-black/10" />
          </div>
          <div className="col-span-2 space-y-3">
            <p className="text-sm font-semibold">Loading product details...</p>
            <div className="h-4 w-full animate-pulse bg-black/10" />
            <div className="h-4 w-5/6 animate-pulse bg-black/10" />
            <div className="h-4 w-2/3 animate-pulse bg-black/10" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-16 animate-pulse bg-black/10" />
            <div className="h-4 w-24 animate-pulse bg-black/10" />
            <div className="h-4 w-20 animate-pulse bg-black/10" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-16 animate-pulse bg-black/10" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 animate-pulse border-2 border-dashed border-black/10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsFallback />}>
      <ProductById params={params} />
    </Suspense>
  );
}
