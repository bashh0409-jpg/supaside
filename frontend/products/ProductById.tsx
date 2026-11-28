import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { sampleProducts } from "../lib/products";

export default async function ProductById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = sampleProducts.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
