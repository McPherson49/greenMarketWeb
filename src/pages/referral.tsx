"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Share2,
  Wallet,
  Zap,
} from "lucide-react";

export default function ReferralPage() {
  const howItWorks = [
    {
      step: "1",
      title: "Share Your Link",
      description:
        "Copy your unique referral link and share it with friends, farmers, and buyers on WhatsApp, social media, or SMS.",
      icon: Share2,
      color: "bg-blue-500",
    },
    {
      step: "2",
      title: "They Join & Upgrade",
      description:
        "When someone signs up with your link, uploads a product, and activates Premium, you earn 100% of the Premium fee.",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      step: "3",
      title: "Earn Rewards",
      description:
        "Your reward is credited instantly after your referral completes their first Premium activation.",
      icon: Gift,
      color: "bg-amber-500",
    },
    {
      step: "4",
      title: "Withdraw or Boost",
      description:
        "After referring 4 people, withdraw your earnings to your bank or use them to boost your products for more visibility.",
      icon: TrendingUp,
      color: "bg-emerald-500",
    },
  ];

  const benefits = [
    { text: "Unlimited earning potential with no cap on referrals", icon: Zap },
    { text: "Instant reward points on successful referrals", icon: Gift },
    { text: "Withdraw cash directly to your bank account", icon: Wallet },
    { text: "Boost your products to reach more buyers", icon: TrendingUp },
    {
      text: "Help build Nigeria's largest agricultural marketplace",
      icon: Users,
    },
    {
      text: "Points remain active as long as your account is",
      icon: CheckCircle,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full text-emerald-700 text-sm font-medium mb-6">
                <Gift className="w-4 h-4" />
                Rewards Program
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Refer Friends,{" "}
                <span className="text-[#39B54A]">Earn Rewards</span>
              </h1>

              <p className="text-xl text-gray-600 mb-4">
                Get paid for every friend you invite to GreenMarket.
              </p>

              <p className="text-lg text-gray-500 mb-8">
                Earn points when your referrals sign up, uploads a product, and
                activates Premium. Use points to boost your listings or withdraw
                as cash to your bank account.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 bg-[#39B54A] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#2d8f3a] transition"
                >
                  Get Your Link
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition"
                >
                  How It Works
                </Link> */}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">₦50k+</p>
                  <p className="text-sm text-gray-500 mt-1">Top Earner</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-500 mt-1">Active Referrers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">2,000+</p>
                  <p className="text-sm text-gray-500 mt-1">Referrals Made</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/refer.png"
                  alt="Referral rewards"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to start earning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-4 h-full border border-gray-200 hover:border-[#39B54A] transition">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-gray-900 font-bold text-lg mb-6">
                      {item.step}
                    </div>

                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 ${item.color} rounded-xl mb-6`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Join Our Referral Program?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just rewards — help grow Nigeria's agricultural
              marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 border border-gray-200 rounded-xl hover:border-[#39B54A] hover:bg-gray-50 transition"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#39B54A]" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Earnings Example */}
      <section className="bg-gray-50 py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Earnings Calculator
              </h2>
              <p className="text-lg text-gray-600">See how much you can earn</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-2">5 Referrals</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">500</p>
                <p className="text-sm text-gray-500">points (₦50)</p>
              </div>

              <div className="text-center p-6 bg-emerald-50 rounded-xl border-2 border-[#39B54A]">
                <p className="text-gray-600 mb-2">20 Referrals</p>
                <p className="text-3xl font-bold text-[#39B54A] mb-1">2,000</p>
                <p className="text-sm text-gray-600">points (₦200)</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-2">50 Referrals</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">5,000</p>
                <p className="text-sm text-gray-500">points (₦500)</p>
              </div>
            </div>

            <p className="text-center text-gray-500 mt-8">
              * Earn 100 points per successful referral. 10 points = ₦1
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#39B54A] py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Earning Today
          </h2>
          <p className="text-emerald-50 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users earning rewards by sharing GreenMarket with
            their network
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#39B54A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Your Referral Link
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
