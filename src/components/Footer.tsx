"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
import { CiLinkedin, CiMail } from "react-icons/ci";
import {
  FaPhoneAlt,
  FaYoutubeSquare,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter, FaChevronDown, FaChevronUp } from "react-icons/fa6";

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const footerBottomRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      setTimeout(() => {
        footerBottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);
    }
  };

  const appLinks = {
    android:
      "https://play.google.com/store/apps/details?id=com.zagytech.greenmarket.green_market",
    ios: "https://apps.apple.com/app/id123456789",
  };

  return (
    <footer className="bg-emerald-50 text-black border-t border-neutral-200">
      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden pb-20">
        {/* Always-visible top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="GreenMarket Logo"
              width={100}
              height={40}
              priority
            />
          </Link>

          <div className="flex items-center gap-8">
            {/* Google Play only shown when collapsed */}
            {!isExpanded && (
              <GooglePlayButton
                url={appLinks.android}
                theme="light"
                className="p-0.5! border! border-neutral-400! scale-90 origin-right"
              />
            )}

            {/* Toggle chevron */}
            <button
              onClick={toggleExpanded}
              aria-label="Toggle footer menu"
              className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors text-emerald-700"
            >
              {isExpanded ? (
                <FaChevronUp size={16} />
              ) : (
                <FaChevronDown size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible content */}
        {isExpanded && (
          <div
            style={{
              animation:
                "footerSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            <div className="px-4 pb-6 pt-2 border-t border-neutral-200 space-y-6">
              {/* Ministry endorsement */}
              <div className="flex items-center gap-3 mt-2">
                <Image
                  src="/assets/Federal-Ministry-of-Agriculture-and-Rural-Development-1.jpg"
                  alt="Federal Ministry of Agriculture"
                  width={60}
                  height={60}
                  className="rounded"
                  priority
                />
                <p className="text-xs text-gray-600 leading-tight">
                  Endorsed by the Federal Ministry of Agriculture and Rural
                  Development
                </p>
              </div>

              {/* Links grid: 2 columns */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {/* Company */}
                <div>
                  <h3 className="font-bold text-sm mb-2 text-emerald-700">
                    Company
                  </h3>
                  <ul className="space-y-1.5 text-sm font-light">
                    {[
                      { label: "About Us", href: "/about" },
                      { label: "FAQ", href: "/faq" },
                      { label: "Terms & Conditions", href: "/terms" },
                      { label: "Privacy Policy", href: "/privacy" },
                      { label: "Contact Us", href: "/contact" },
                      { label: "Careers", href: "/coming-soon" },
                    ].map((item) => (
                      <li key={item.href}>
                        <Link
                          className="hover:text-[#39B54A] transition duration-300"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Account */}
                <div>
                  <h3 className="font-bold text-sm mb-2 text-emerald-700">
                    Account
                  </h3>
                  <ul className="space-y-1.5 text-sm font-light">
                    {[
                      { label: "Sign In", href: "/signin" },
                      { label: "My Wishlist", href: "/profile" },
                      { label: "Product", href: "/products" },
                      { label: "Order", href: "/orders" },
                      { label: "Profile", href: "/profile" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          className="hover:text-[#39B54A] transition duration-300"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Corporate */}
                <div className="col-span-2">
                  <h3 className="font-bold text-sm mb-2 text-emerald-700">
                    Corporate
                  </h3>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm font-light">
                    {[
                      { label: "How GreenMarket Works", href: "/about" },
                      { label: "How Escrow Works", href: "/howEscrowWorks" },
                      { label: "Farm Business", href: "/coming-soon" },
                      { label: "Farm Careers", href: "/coming-soon" },
                      { label: "Our Suppliers", href: "/coming-soon" },
                      { label: "Promotions", href: "/coming-soon" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          className="hover:text-[#39B54A] transition duration-300"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact + Social */}
              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FaPhoneAlt className="text-emerald-600" />
                  <span>+2348022117935</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CiMail className="text-lg text-emerald-600" />
                  <span>support@greenmarket.com.ng</span>
                </div>
                <div className="flex text-[#39B54A] items-center gap-4 text-xl pt-1">
                  {[
                    { icon: <FaFacebookF />, href: "http://facebook.com" },
                    { icon: <FaXTwitter />, href: "http://twitter.com" },
                    { icon: <FaInstagram />, href: "http://instagram.com" },
                    { icon: <CiLinkedin />, href: "http://linkedin.com" },
                    { icon: <FaYoutubeSquare />, href: "http://youtube.com" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      className="hover:scale-125 transition duration-300"
                      target="_blank"
                      href={item.href}
                    >
                      {item.icon}
                    </Link>
                  ))}
                </div>
              </div>

              {/* App store buttons — both visible when expanded */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-sm text-emerald-700">
                  Install App
                </h3>
                <p className="text-xs text-gray-500 -mt-2">
                  Secured Payment Gateways
                </p>
                <div className="flex flex-col gap-3">
                  <GooglePlayButton
                    url={appLinks.android}
                    theme="light"
                    className="p-1! border! border-neutral-400!"
                  />
                  <AppStoreButton
                    url={appLinks.ios}
                    theme="light"
                    className="p-1! border! border-neutral-400!"
                  />
                </div>
              </div>

              {/* Copyright */}
              <p className="text-xs text-gray-500 text-center">
                &copy; {new Date().getFullYear()}{" "}
                <span className="text-[#39B54A] font-semibold">
                  Greenmarket
                </span>{" "}
                — All rights reserved
              </p>

              {/* Scroll target — snaps view to bottom of footer */}
              <div ref={footerBottomRef} />
            </div>
          </div>
        )}
      </div>

      {/* Keyframes for slide-down animation */}
      <style>{`
        @keyframes footerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* ── DESKTOP LAYOUT (unchanged) ── */}
      <div className="hidden md:block py-10">
        <div className="container max-w-7xl mx-auto grid grid-cols-5 gap-4 px-4">
          {/* Company Info */}
          <div>
            <Link href={"/"} className="flex items-center mb-4">
              <Image
                src="/assets/logo.svg"
                alt="GreenMarket Logo"
                width={120}
                height={120}
                priority
              />
            </Link>
            <Image
              src="/assets/Federal-Ministry-of-Agriculture-and-Rural-Development-1.jpg"
              alt="Secured Payment"
              width={200}
              height={100}
              className="mt-4"
              priority
            />
            <p className="text-xs mt-2">
              Endorsed by the Federal Ministry of Agriculture and Rural
              Development
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 font-light">
              {[
                { label: "About Us", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Contact Us", href: "/contact" },
                { label: "Careers", href: "/coming-soon" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    className="hover:text-[#39B54A] transition duration-700"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold mb-4">Account</h3>
            <ul className="space-y-2 font-light">
              {[
                { label: "Sign In", href: "/signin" },
                { label: "My Wishlist", href: "/profile" },
                { label: "Product", href: "/products" },
                { label: "Order", href: "/orders" },
                { label: "Profile", href: "/profile" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    className="hover:text-[#39B54A] transition duration-700"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h3 className="font-bold mb-4">Corporate</h3>
            <ul className="space-y-2 font-light">
              {[
                { label: "How GreenMarket Works", href: "/about" },
                { label: "How Escrow Works", href: "/howEscrowWorks" },
                { label: "Farm Business", href: "/coming-soon" },
                { label: "Farm Careers", href: "/coming-soon" },
                { label: "Our Suppliers", href: "/coming-soon" },
                { label: "Promotions", href: "/coming-soon" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    className="hover:text-[#39B54A] transition duration-700"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Install App */}
          <div>
            <h3 className="font-bold mb-4">Install App</h3>
            <p className="text-sm font-light mb-4">Secured Payment Gateways</p>
            <div className="flex flex-col gap-4 mt-6">
              <GooglePlayButton
                url={appLinks.android}
                theme="light"
                className="p-1! border! border-neutral-400!"
              />
              <AppStoreButton
                url={appLinks.ios}
                theme="light"
                className="p-1! border! border-neutral-400!"
              />
            </div>
          </div>
        </div>

        {/* Desktop Bottom */}
        <div className="border-t max-w-7xl mx-auto flex flex-col-reverse border-neutral-300 mt-10 pt-4 text-center md:flex md:justify-between md:items-center px-4">
          <p className="text-sm mt-3 text-left md:mb-0">
            &copy; {new Date().getFullYear()},{" "}
            <span className="text-[#39B54A] font-semibold">Greenmarket</span> -
            All rights reserved
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FaPhoneAlt />
              <span>+2348022117935</span>
            </div>
            <div className="flex items-center gap-2">
              <CiMail className="text-lg" />
              <span>support@greenmarket.com.ng</span>
            </div>
            <div className="flex text-[#39B54A] items-center gap-3 text-lg">
              {[
                { icon: <FaFacebookF />, href: "http://facebook.com" },
                { icon: <FaXTwitter />, href: "http://twitter.com" },
                { icon: <FaInstagram />, href: "http://instagram.com" },
                { icon: <CiLinkedin />, href: "http://linkedin.com" },
                { icon: <FaYoutubeSquare />, href: "http://youtube.com" },
              ].map((item, i) => (
                <Link
                  key={i}
                  className="hover:scale-150 transition duration-700"
                  target="_blank"
                  href={item.href}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
