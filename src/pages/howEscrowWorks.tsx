import React from "react";
import { Shield, CheckCircle, Lock, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Newsletter from "@/components/newsletter/Newsletter";
import SafetyMeasuresSection from "@/components/Safetytips";

export default function EscrowPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen  to-emerald-100">
      {/* Hero Section */}
      <section
        className="py-12 max-w-7xl mx-auto w-full h-75 lg:py-20 cursor-pointer"
        style={{
          background: "url('/assets/howescrowworks.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        onClick={() => router.push("/shop")}
      ></section>

      {/* How Escrow Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
            How Escrow Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Buyer Sends Payment
              </h3>
              <p className="text-gray-600">
                The buyer sends an agreed payment to the escrow agent.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Payment Confirmation
              </h3>
              <p className="text-gray-600">
                The escrow agent confirms the payment and notifies the seller.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Goods Exchange
              </h3>
              <p className="text-gray-600">
                The seller and buyer meet to exchange the goods.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Funds Release
              </h3>
              <p className="text-gray-600">
                The buyer confirms receipt of the goods and escrow agent
                releases the payment to the seller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section
        id="advantages"
        className="py-16 bg-linear-to-br from-gray-50 to-green-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
            Advantages of Using Escrow
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Buyers */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Buyers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Security:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      Your payment is protected until you confirm receipt of
                      goods.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Peace of Mind:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      Ensures you get the goods as agreed before releasing
                      payment.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Dispute Protection:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      Escrow acts as a mediator in case of disagreements.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Sellers */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Sellers
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Guaranteed Payment:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      Ensures the buyer has funds before the transaction starts.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Build Trust and Confidence:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      Attracts more buyers by allowing secure payments.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Simplified Process:
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      No worries about fake or bounced payments.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#39B54A] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Transactions?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of satisfied users who trust our escrow service for
            safe and secure transactions.
          </p>
          <Link
            href={"/shop"}
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Using Escrow Today
          </Link>
        </div>
      </section>

      <div className="mt-20">
        <SafetyMeasuresSection />
        <Newsletter />
      </div>
    </div>
  );
}
