"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Leaf, Users, Smartphone, Gift } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    adaptiveHeight: true, // Changed to true
  };

  const slides = [
    {
      title: "The No. 1 Free Online Market for Farmers & Buyers in Nigeria",
      description2:
        "Buy and sell fresh agricultural products with ease. GreenMarket connects farmers with serious buyers for a simple, hassle-free trading experience.",
      imageUrl: "/assets/vegetable.png",
      imageAlt: "Vegetables illustration",
      bg: "assets/bg-img.png",
      bgMobile: "assets/mobile.png",
      buttonText: "Learn More",
      buttonLink: "/shop",
      buttonPosition: "left",
      centered: true,
      darkOverlay: true,
    },
    {
      badgeText: "Escrow Secured",
      title: "Safe and Secure Transactions with Escrow",
      description: "Ensure trust and safety in every deal.",
      description2:
        "Escrow protects your money and guarantees a fair exchange for both buyers and sellers.",
      imageUrl: "/assets/hero.svg",
      imageAlt: "Escrow illustration",
      bg: "/assets/Footer.png",
      icon: Leaf,
      buttonText: "Learn More",
      buttonLink: "/howEscrowWorks",
      buttonPosition: "left",
    },
    {
      badgeText: "New Feature Alert",
      title: "Introducing Community — Connect & Share",
      description:
        "Join a growing community of buyers and sellers sharing experiences, insights, and feedback.",
      description2:
        "Ask questions, post reviews, and connect with others to make smarter, more confident purchases.",
      imageUrl: "/assets/hero2.jpg",
      imageAlt: "Community feature illustration",
      bg: "/assets/escrowbg.png",
      icon: Users,
      buttonText: "Join the Community",
      buttonLink: "/community",
      buttonPosition: "right",
    },
    {
      badgeText: "Rewards Program",
      title: "Earn Points, Get Rewarded — Refer & Earn!",
      description:
        "Invite friends to join Greenmarket and earn reward points for every successful referral.",
      description2:
        "Use your points to boost your products for better visibility or withdraw them as cash. The more you refer, the more you earn!",
      imageUrl: "/assets/hero.svg", 
      imageAlt: "Referral rewards illustration",
      bg: "/assets/escrowbg.png",
      icon: Gift,
      buttonText: "Learn More",
      buttonLink: "/referral",
      buttonPosition: "left",
    },
    {
      badgeText: "Now on Mobile",
      title: "Greenmarket is now available on Android and iOS",
      description:
        "Shop, sell, and manage your transactions anywhere, anytime. Experience Greenmarket on the go.",
      imageUrl: "/assets/appdownload.png",
      imageAlt: "Mobile app mockup",
      bg: "/assets/Footer.png",
      icon: Smartphone,
      buttonPosition: "center",
      appLinks: {
        android:
          "https://play.google.com/store/apps/details?id=host.exp.exponent",
        ios: "https://apps.apple.com/us/app/expo-go/id982107779",
      },
    },
  ];

  return (
    <section className="rounded-xl overflow-hidden">
      <style jsx global>{`
        .slick-slider {
          position: relative;
        }
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          color: white;
          font-size: 10px;
        }
        .slick-dots li.slick-active button:before {
          color: #10b981;
        }
        .slick-prev,
        .slick-next {
          z-index: 20;
        }
        .slick-prev {
          left: 20px;
        }
        .slick-next {
          right: 20px;
        }
        .slick-prev:before,
        .slick-next:before {
          font-size: 30px;
          color: white;
        }
      `}</style>

      <Slider {...settings}>
        {slides.map((slide, index) => {
          const Icon = slide.icon;

          return (
            <div key={index}>
              <div
                className="relative bg-center bg-no-repeat bg-cover min-h-[400px] md:min-h-[500px]"
                style={{
                  backgroundImage: `url(${
                    isMobile && slide.bgMobile ? slide.bgMobile : slide.bg
                  })`,
                }}
              >
                {/* Overlay */}
                <div
                  className={`absolute inset-0 ${
                    slide.darkOverlay ? "bg-[#000000]/50" : "bg-white/40"
                  }`}
                ></div>

                {/* Conditional Layout: Centered or Left-Right */}
                {slide.centered ? (
                  <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 py-12 md:py-16 lg:px-20 min-h-[400px] md:min-h-[500px]">
                    <div className="max-w-3xl">
                      <h1
                        className={`text-3xl md:text-5xl font-bold ${
                          slide.darkOverlay ? "text-white" : "text-[#253D4E]"
                        }`}
                      >
                        {slide.title}
                      </h1>

                      {slide.description2 && (
                        <p
                          className={`mt-4 text-sm md:text-base ${
                            slide.darkOverlay
                              ? "text-white"
                              : "text-[#253D4E]/80"
                          }`}
                        >
                          {slide.description2}
                        </p>
                      )}

                      {slide.buttonLink && (
                        <div className="mt-8">
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm md:text-base text-white hover:bg-emerald-700 transition"
                          >
                            {slide.buttonText}{" "}
                            <ChevronRight className="size-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // STANDARD LEFT-RIGHT LAYOUT (for other slides)
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 py-12 md:py-10 lg:px-20 min-h-[400px] md:min-h-[500px]">
                    {/* LEFT SIDE */}
                    <div className="max-w-xl">
                      {slide.badgeText && Icon && (
                        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100/60 px-3 py-1 text-emerald-700 text-xs font-medium">
                          <Icon className="size-4" /> {slide.badgeText}
                        </p>
                      )}

                      <h1 className="mt-3 text-3xl md:text-5xl font-bold text-[#253D4E]">
                        {slide.title}
                      </h1>

                      {slide.description && (
                        <p className="mt-3 text-base md:text-lg font-semibold text-[#253D4E]">
                          {slide.description}
                        </p>
                      )}

                      {slide.description2 && (
                        <p className="mt-2 text-sm md:text-base text-[#253D4E]/80">
                          {slide.description2}
                        </p>
                      )}

                      {/* Escrow/Referral button (Left) */}
                      {slide.buttonPosition === "left" && slide.buttonLink && (
                        <div className="mt-6">
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm md:text-base text-white hover:bg-emerald-700 transition"
                          >
                            {slide.buttonText}{" "}
                            <ChevronRight className="size-4" />
                          </Link>
                        </div>
                      )}

                      {/* App Store buttons (Center) */}
                      {slide.buttonPosition === "center" && slide.appLinks && (
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                          <GooglePlayButton
                            url={slide.appLinks.android}
                            theme="light"
                            className=" !p-1 !border !border-neutral-400"
                          />
                          <AppStoreButton
                            url={slide.appLinks.ios}
                            theme="light"
                            className=" !p-1 !border !border-neutral-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* RIGHT SIDE */}
                    {slide.imageUrl && (
                      <div className="flex flex-col items-center mt-8 md:mt-0">
                        <div className="relative w-[240px] md:w-[340px] h-[200px] md:h-[280px]">
                          <Image
                            src={slide.imageUrl}
                            alt={slide.imageAlt}
                            fill
                            className="object-contain rounded-lg"
                            priority={index === 0}
                          />
                        </div>

                        {/* Community button (Right) */}
                        {slide.buttonPosition === "right" &&
                          slide.buttonLink && (
                            <Link
                              href={slide.buttonLink}
                              className="inline-flex items-center gap-2 mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm md:text-base text-white hover:bg-emerald-700 transition"
                            >
                              {slide.buttonText}{" "}
                              <ChevronRight className="size-4" />
                            </Link>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
}