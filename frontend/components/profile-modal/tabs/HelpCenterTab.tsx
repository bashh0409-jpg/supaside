"use client";

import { useState } from "react";

const questions = [
  {
    question: "Can I place an order on the site?",
    answer:
      "The current site is for browsing and does not provide checkout or accept orders or payments.",
  },
  {
    question: "Does adding an item to my cart reserve it?",
    answer:
      "No. Adding an item to your cart does not create a purchase or reserve stock.",
  },
  {
    question: "Can I track an order here?",
    answer:
      "Order tracking is not currently connected to a live order system on this site.",
  },
  {
    question: "How do I request a return or refund?",
    answer:
      "This site does not currently accept orders, so return requests and refunds are not available through the account area.",
  },
  {
    question: "How can I update my shipping address?",
    answer:
      "Open the Shipping tab in your profile. Add an address or select a saved address to edit it. You can also delete an address from its edit window.",
  },
  {
    question: "Can product details or availability change?",
    answer:
      "Yes. Product details, prices, sizes, and availability are provided for browsing and may change or contain errors.",
  },
  {
    question: "Can I save more than one shipping address?",
    answer:
      "Yes. Use Add address in the Shipping tab to save another address. Your saved addresses are listed there.",
  },
  {
    question: "How do I delete a saved shipping address?",
    answer:
      "In the Shipping tab, select the address row, choose Delete in the editor, then confirm.",
  },
  {
    question: "Why can't I save my shipping address?",
    answer:
      "Check that recipient, address line 1, city, province, and postal code are filled in, and that you are signed in. If it still fails, try again later.",
  },
  {
    question: "Will changing my saved address update an order?",
    answer:
      "The site does not currently have a live checkout or order system, so saved address changes are not linked to an order.",
  },
  {
    question: "Does the cart mean my purchase is confirmed?",
    answer:
      "No. The cart is for browsing only. The site currently does not accept orders or payments.",
  },
  {
    question: "Can I change or cancel an order?",
    answer:
      "Orders cannot currently be placed through this site, so there are no site orders to change or cancel.",
  },
];

export default function HelpCenterTab() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {questions.map(({ question, answer }, index) => {
            const isOpen = openQuestion === index;
            const answerId = `help-answer-${index}`;

            return (
              <div
                key={question}
                className="rounded border border-dashed border-gray-300"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenQuestion(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 p-2 text-left text-sm font-semibold"
                >
                  <span>{question}</span>
                </button>
                <div
                  id={answerId}
                  className="border-gray-300 font-semibold p-3 text-xs leading-relaxed mute"
                >
                  {answer}
                </div>
              </div>
            );
          })}
          <div className="rounded border border-dashed border-gray-300 p-3">
            <h2 className="text-sm font-semibold">Still need help?</h2>
            <p className="mt-1 text-xs font-semibold leading-relaxed mute">
              Contact us at{" "}
              <a
                href="mailto:info@supaside.store"
                className="font-semibold underline underline-offset-2"
              >
                info@supaside.store
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
