import Link from "next/link";
import React from "react";

const Footer = () => {
  const footerNav =
    "text-xs text-white/50 uppercase  cursor-pointer hover:text-white duration-400 font-semibold";
  return (
    <div className=" w-full pt-10 text-white p-2 bg-black">
      <div className="h-50 w-full grid grid-cols-4 text-white p-2">
        <div className=" flex-flex-col">
          <p className="text-sm  cursor-pointer font-semibold">Shop</p>

          <div className="mt-3 gap-2 flex flex-col">
            <p className={footerNav}>All</p>{" "}
            <p className={footerNav}>Collections</p>
          </div>
        </div>

        <div className=" flex-flex-col">
          <p className="text-sm  cursor-pointer font-semibold">Assistance</p>

          <div className="mt-3 gap-2 flex flex-col">
            <p className={footerNav}>order & shipping</p>{" "}
            <p className={footerNav}>return & exchange</p>
            <p className={footerNav}>Size guide</p>
            <p className={footerNav}>contact us</p>
          </div>
        </div>

        <div className=" flex-flex-col">
          <p className="text-sm  cursor-pointer font-semibold">Legal</p>

          <div className="mt-3 gap-2 flex flex-col">
            <p className={footerNav}>Terms of service</p>{" "}
            <p className={footerNav}>Privacy policy</p>
          </div>
        </div>

        <div className=" flex-flex-col">
          <p className="text-sm  cursor-pointer font-semibold">Resources</p>

          <div className="mt-3 gap-2 flex flex-col">
            <p className={footerNav}>Feedback</p>
            <p className={footerNav}>News</p>
          </div>
        </div>
      </div>
      <div className=" w-full grid grid-cols-4 text-white p-4">
        <p className="text-sm  cursor-pointer font-semibold duration-500 hover:bg-blue-700 p-1">
          ©Supaside. All rights reserved{" "}
        </p>
        <p className="text-sm  cursor-pointer font-semibold duration-500 hover:bg-blue-700 p-1">
          ©2026
        </p>
        <Link
          href="/terms"
          className="text-sm  cursor-pointer hover:bg-blue-700 p-1 duration-500 font-semibold"
        >
          Terms of use
        </Link>
        <Link
          href="/privacy"
          className="text-sm cursor-pointer hover:bg-blue-700 p-1 duration-500 font-semibold"
        >
          Privacy policy
        </Link>
      </div>
      <div className="h-[clamp(3rem,14vw,16rem)] w-full overflow-hidden">
        <p className="relative cursor-pointer whitespace-nowrap text-center text-[clamp(5rem,23vw,25rem)] font-bold leading-none tracking-tighter">
          Supaside
        </p>
      </div>
    </div>
  );
};

export default Footer;
