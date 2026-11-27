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
const orders: Order[] = [
  {
    id: "1001",
    name: "Product name",
    image: "/logo.jpg",
    date: "27 Nov 2026",
    status: "Processing",
    courier: null,
    trackingCode: 'eferfjh12e3erfuirrefhgrghfhrjgrfergverververwfq3egvtreftvbeqrv',
    total: "R 499.00",
  },
  {
    id: "1002",
    name: "Another product",
    image: "/logo.jpg",
    date: "20 Nov 2026",
    status: "Delivered",
    courier: null,
    trackingCode: null,
    total: "R 1,250.00",
  },
  {
    id: "10023",
    name: "Another product",
    image: "/logo.jpg",
    date: "20 Nov 2026",
    status: "Returned",
    courier: null,
    trackingCode: null,
    total: "R 1,250.00",
  },
];

export default function OrdersTab() {
  const [copyFeedback, setCopyFeedback] = useState<
    Record<string, "copied" | "error">
  >({});

  async function copyTrackingCode(orderId: string, trackingCode: string) {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopyFeedback((current) => ({ ...current, [orderId]: "copied" }));
    } catch (error) {
      console.error("Unable to copy the order tracking code:", error);
      setCopyFeedback((current) => ({ ...current, [orderId]: "error" }));
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
              You have no orders yet.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-xs">
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
                      <td className="py-4 pr-4 font-semibold">{order.name}</td>
                      <td className="mute font-semibold whitespace-nowrap py-4 pr-4">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 font-semibold">
                        {order.courier ?? "—"}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 font-semibold">
                        {order.trackingCode ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="block max-w-[8rem] cursor-copy truncate border-0 bg-transparent p-0 text-left font-semibold"
                              onClick={() =>
                                void copyTrackingCode(order.id, order.trackingCode)
                              }
                              title={order.trackingCode}
                              aria-label={`Copy tracking code ${order.trackingCode}`}
                            >
                              {order.trackingCode}
                            </button>
                            {copyFeedback[order.id] === "copied" && (
                              <span className="mute" role="status">
                                Copied
                              </span>
                            )}
                            {copyFeedback[order.id] === "error" && (
                              <span className="text-red-600" role="alert">
                                Copy failed
                              </span>
                            )}
                          </div>
                        ) : (
                          "—"
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
