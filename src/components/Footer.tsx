"use client";

import Link from "next/link";
import Image from "next/image";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
import { CiFacebook, CiLinkedin, CiMail } from "react-icons/ci";
import { FaPhoneFlip, FaXTwitter } from "react-icons/fa6";
import {
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaPhoneAlt,
  FaYoutube,
  FaYoutubeSquare,
} from "react-icons/fa";

const Footer = () => {
  const slide = {
    buttonPosition: "center",
    appLinks: {
      android: "https://play.google.com/store/apps/details?id=com.greenmarket",
      ios: "https://apps.apple.com/app/id123456789",
    },
  };

  return (
    <footer className="bg-emerald-50 text-black py-10 border-t border-neutral-50">
      <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 px-4">
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
          <p className="text-xs">
            <span>
              Endorsed by the Federal Ministry of Agriculture and Rural
              Development
            </span>
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold mb-4">Company</h3>
          <ul className="space-y-2 font-light">
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/about">About Us</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/faq">FAQ</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/contact">Contact Us</Link>
            </li>
           
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/careers">Careers</Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-bold mb-4">Account</h3>
          <ul className="space-y-2 font-light">
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/signin">Sign In</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/wishlist">My Wishlist</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/products">Product</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/orders">Order</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/profile">Profile</Link>
            </li>
          </ul>
        </div>

        {/* Corporate */}
        <div>
          <h3 className="font-bold mb-4">Corporate</h3>
          <ul className="space-y-2 font-light">
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/about">How GreenMarket Works</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/howEscrowWorks">How Escrow Works</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/coming-soon">Farm Business</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/coming-soon">Farm Careers</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/coming-soon">Our Suppliers</Link>
            </li>
            <li>
              <Link className="hover:text-[#39B54A] transform transition duration-700" href="/coming-soon">Promotions</Link>
            </li>
          </ul>
        </div>

        {/* Install App */}
        <div>
          <h3 className="font-bold mb-4">Install App</h3>
          <p className="text-sm font-light mb-4">Secured Payment Gateways</p>
          {slide.buttonPosition === "center" && slide.appLinks && (
            <div className="flex flex-col sm:flex-col gap-4 mt-6">
              <GooglePlayButton
                url={slide.appLinks.android}
                theme="light"
                className="!p-1 !border !border-neutral-400"
              />
              <AppStoreButton
                url={slide.appLinks.ios}
                theme="light"
                className="!p-1 !border !border-neutral-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t max-w-7xl mx-auto flex flex-col-reverse  border-neutral-300 mt-10 pt-4 text-center md:flex md:justify-between md:items-center px-4">
        <p className="text-sm mt-3 text-left md:mb-0">
          &copy; {new Date().getFullYear()},
          <span className="text-[#39B54A] font-semibold">Greenmarket</span> -
          All rights reserved
        </p>

        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
          <div className="flex  items-center gap-2">
            <FaPhoneAlt />
            <span className="">+2349099989016</span>
          </div>
          <div className="flex items-center gap-2">
            <CiMail className="text-lg" />
            <span className="">support@greenmarket.com.ng</span>
          </div>
          <div className="flex text-[#39B54A] items-center gap-3 text-lg">
            <Link
              className="transform hover:scale-150 transition duration-700"
              target="_blank"
              href="http://facebook.com"
            >
              <FaFacebookF />
            </Link>
            <Link
              className="transform hover:scale-150 transition duration-700"
              target="_blank"
              href="http://twitter.com"
            >
              <FaXTwitter />
            </Link>
            <Link
              className="transform hover:scale-150 transition duration-700"
              target="_blank"
              href="http://instagram.com"
            >
              <FaInstagram />
            </Link>
            <Link
              className="transform hover:scale-150 transition duration-700"
              target="_blank"
              href="http://Linkedin.com"
            >
              <CiLinkedin />
            </Link>
            <Link
              className="transform hover:scale-150 transition duration-700"
              target="_blank"
              href="http://youtube.com"
            >
              <FaYoutubeSquare />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
