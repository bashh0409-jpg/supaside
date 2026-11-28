"use client";

import { useState } from "react";
import { orders } from "./OrdersTab";

export default function ReturnTab() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const returnedOrders = orders.filter((order) => order.status === "Returned");

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
          {returnedOrders.length === 0 ? (
            <p className="mute font-mono text-xs font-medium uppercase">
              You have no returned orders yet.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                <caption className="sr-only">Your returned orders</caption>
                <thead>
                  <tr className="mute text-xs uppercase">
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
                  {returnedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="cursor-pointer border-b border-gray-200"
                    >
                      <td className="py-1 pr-4">
                        <div className="aspect-square w-10 overflow-hidden bg-black/10">
                          <img
                            src={order.image}
                            alt={order.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="max-w-[10rem] truncate py-4 pr-4 font-semibold capitalize">
                        {order.name}
                      </td>
                      <td className="mute whitespace-nowrap py-4 pr-4 font-semibold">
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
                            onClick={() =>
                              void copyTrackingCode(order.trackingCode!)
                            }
                          >
                            {copiedCode === order.trackingCode
                              ? "Copied!"
                              : order.trackingCode}
                          </button>
                        ) : (
                          <span className="block">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 font-semibold">
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
