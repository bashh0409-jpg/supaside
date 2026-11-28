"use client";

import { useState } from "react";

type Order = {
  id: string;
  name: string;
  image: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  courier: string | null;
  trackingCode: string | null;
  total: string;
};

// Replace with your real orders from Supabase
export const orders: Order[] = [
  {
    id: "1001",
    name: "5 Leaf clover bracelet",
    image: "/logo.jpg",
    date: "27 Nov 2026",
    status: "Processing",
    courier: "DHL",
    trackingCode: 'SS_t5fe26fdsatvg54yegnme663',
    total: "R 499.00",
  },
  {
    id: "10012",
    name: "LG 4K ultra wide monitor",
    image: "/logo.jpg",
    date: "27 Nov 2026",
    status: "Delivered",
    courier: "Aramex",
    trackingCode: 'SS_t5fe26fds4fcq3gnme663',
    total: "R 9499.00",
  },
  {
    id: "1002",
    name: "Clover enamel bracelet pack",
    image: "/logo.jpg",
    date: "20 Nov 2026",
    status: "Shipped",
    courier: 'RAM',
    trackingCode: "SS_engdi530gdao58gyegnme663",
    total: "R 1,250.00",
  },
  {
    id: "10023",
    name: "14ct rose plated mother of perl clover bracelet",
    image: "/logo.jpg",
    date: "20 Nov 2026",
    status: "Returned",
    courier: 'Courier Guy',
    trackingCode: "SS_ftghd43fy67f546yegnme663",
    total: "R 1,250.00",
  },
];

export default function OrdersTab() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function copyTrackingCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current));
      }, 1500);
    } catch (error) {
      console.error("Unable to copy the tracking code:", error);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <figure>
       
        <img
          src="/logo.jpg"
          className="w-50 aspect-[4/5] object-cover"
          alt="Profile Image"
        />
      </figure>

      <div className="col-span-2 w-full">
        <div className="flex h-full flex-col">
          {orders.length === 0 ? (
            <p className="mute font-mono text-xs font-medium uppercase">
              You have no recorded orders yet.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px]  border-collapse text-left text-xs">
                <caption className="sr-only">Your orders</caption>
                <thead>
                  <tr className="mute  text-xs uppercase">
                    <th scope="col" className="w-24 pb-8 pr-4 font-semibold">
                      Image
                    </th>
                    <th scope="col" className="pb-8 pr-4 font-semibold">
                      Name
                    </th>
                    <th scope="col" className="pb-8 pr-4 font-semibold">
                      Date
                    </th>
                    <th scope="col" className="pb-8 pr-4 font-semibold">
                      Courier
                    </th>
                    <th scope="col" className="pb-8 pr-4 font-semibold">
                      Tracking code
                    </th>
                    <th scope="col" className="pb-8 pr-4 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="pb-8 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                  </thead>
                  
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b cursor-pointer border-gray-200">
                      <td className="py-1 pr-4">
                        <div className="aspect-square w-10 overflow-hidden bg-black/10">
                          <img
                            src={order.image}
                            alt={order.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-semibold truncate capitalize max-w-[10rem]">{order.name}</td>
                      <td className="mute font-semibold whitespace-nowrap py-4 pr-4">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 font-semibold">
                        {order.courier ?? "—"}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 font-semibold">
                        {order.trackingCode ? (
                          <button
                            type="button"
                            className="block max-w-[8rem] cursor-copy truncate text-left"
                            title={
                              copiedCode === order.trackingCode
                                ? "Copied!"
                                : `Copy ${order.trackingCode}`
                            }
                            onClick={() => void copyTrackingCode(order.trackingCode!)}
                          >
                            {copiedCode === order.trackingCode
                              ? "Copied!"
                              : order.trackingCode}
                          </button>
                        ) : (
                          <span className="block">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 font-semibold ">
                        {order.status}
                      </td>
                      <td className="whitespace-nowrap py-4 text-right font-semibold">
                        {order.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
