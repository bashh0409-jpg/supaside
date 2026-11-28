import Image from "next/image";
import type { Product } from "../lib/products";
import { formatPrice } from "../lib/pricing";

type CartItemProps = {
  product: Product;
  size: string;
  quantity: number;
  isAvailable: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export default function CartItem({
  product,
  size,
  quantity,
  isAvailable,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const decreaseQuantity = () => {
    if (quantity <= 1) {
      onRemove();
      return;
    }

    onQuantityChange(quantity - 1);
  };

  return (
    <div className="mt-1 flex w-full items-center gap-4 rounded-lg bg-white  p-1 py-2">
      <div className="relative aspect-square w-15 shrink-0 overflow-hidden bg-black/10">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="80px"
          unoptimized
          className="object-cover"
        />
      </div>
      <div className="flex h-full w-full flex-col justify-between py-1">
        <div className="flex w-full justify-between text-xs font-semibold capitalize uppercas">
          <p className="capitalize">{product.name}</p>
          {isAvailable ? (
            <p>{formatPrice(product.priceCents)}</p>
          ) : (
            <p className="text-red-500">sold out</p>
          )}
        </div>

        <div className="flex w-full justify-between mt-1 text-xs font-semibold capitalize uppercas mute">
         <span>UK {size}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={`Decrease ${product.name} quantity`}
              onClick={decreaseQuantity}
              className="cursor-pointer p-1 border border-dashed w-4 h-4 flex items-center"
            >
              −
            </button>
            <span className="w-4 flex items-center justify-center">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${product.name} quantity`}
              onClick={() => onQuantityChange(quantity + 1)}
              className="cursor-pointer p-1 border border-dashed w-4 h-4 flex items-center"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex w-full hidden justify-between text-xs font-semibold capitalize">
           <p>{product.color}</p>
        </div>
      </div>
    </div>
  );
}