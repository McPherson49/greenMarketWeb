import React, { useState } from "react";
import { MessageSquare, Users, CreditCard, HelpCircle } from "lucide-react";
import Image from "next/image";
import Newsletter from "@/components/newsletter/Newsletter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Let us know how we can support your farming journey
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Whether you're an experienced farmer or just starting out, whether
              you're a farmer, buyer, or partner, our team is ready to answer
              your questions, help solve challenges, and guide you every step of
              the way.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Have something specific in mind? Reach out through any of the
              options below.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Product Support */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-500">01</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Product Support
              </h3>
              <p className="text-sm text-gray-600">
                Having trouble uploading or managing your products? Our support
                team will help you fix it fast, so your farm keeps running
                without interruption.
              </p>
            </div>

            {/* Partnership & Collaboration */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-500">02</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Partnership & Collaboration
              </h3>
              <p className="text-sm text-gray-600">
                Are you an organization, cooperative, or agribusiness interested
                in working with us? Let's collaborate to grow agriculture and
                make a positive impact together.
              </p>
            </div>

            {/* Payment & Order Issues */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-500">03</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Payment & Order Issues
              </h3>
              <p className="text-sm text-gray-600">
                Facing payment delays, failed transactions, or unfulfilled
                orders? We'll help you sort it out quickly to keep your deals
                running smoothly.
              </p>
            </div>

            {/* General Inquiries */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-500">04</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                General Inquiries
              </h3>
              <p className="text-sm text-gray-600">
                Got a suggestion, complaint, or just want to say hi? We'd love
                to hear from you. Every feedback helps us make Greenmarket
                better for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Farmers Image Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/assets/contact.png"
              alt="Farmers collaborating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-white p-8 rounded-2xl ">
              <div className="mb-6">
                <p className="text-sm text-green-600 font-semibold mb-2">
                  Contact form
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Drop Us a Line
                </h2>
                <p className="text-sm text-gray-500">
                  Your email address will not be published. Required fields are
                  marked *
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="rounded-2xl overflow-hidden ">
                  <Image
                    src="/assets/undraw7.svg"
                    alt="Customer service representative"
                    className="w-full h-[600px] object-contain"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-xl  max-w-xs">
                  <p className="text-lg font-semibold mb-2">
                    We're here to help!
                  </p>
                  <p className="text-sm text-green-100">
                    Our team typically responds within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="mt-20 ">
        <div className="">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
