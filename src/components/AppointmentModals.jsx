"use client";
import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

export const CustomSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        <div className="text-center py-8 px-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment request has been sent successfully. We'll contact
            you soon!
          </p>

          <button
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CustomAppointmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  inputValue1,
  setInputValue1,
  inputValue2,
  setInputValue2,
  inputValue3,
  setInputValue3,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      <div
        className="relative bg-white rounded-xl shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        <div className="relative z-50 mt-40 lg:mt-10">
          <div className="bg-white z-50 lg:px-20 px-10 flex-col lg:flex-row appshadow flex items-center m-auto lg:pl-10 rounded-lg">
            <img
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
              src="../../assets/nurse.svg"
              alt="Nurse icon"
              className="mr-10"
            />
            <div className="absolute right-5 top-5">
              <button
                onClick={onClose}
                className="text-purple-600 hover:text-purple-800 transition-colors"
              >
                <IoIosCloseCircleOutline className="text-4xl" />
              </button>
            </div>
            <form
              id="form"
              ref={form}
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <p className="flex my-5 lg:my-0 justify-center lg:justify-start xs:text-xl items-center gap-3 call">
                <FaPhoneAlt />
                Call Us: +234 904 0170 025
              </p>
              <div className="lg:block flex flex-col items-center justify-center lg:space-x-5">
                <input
                  type="text"
                  name="from_name"
                  value={inputValue1}
                  onChange={(e) => setInputValue1(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="bg-[#263D7B0A] outline-none p-4 mt-5 w-[278px]"
                />
                <input
                  type="text"
                  name="phone_number"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
                  required
                  placeholder="Your Phone"
                  className="bg-[#263D7B0A] outline-none p-4 mt-5 w-[278px]"
                />
              </div>
              <div className="lg:block flex flex-col items-center justify-center lg:space-x-5">
                <input
                  type="email"
                  name="from_email"
                  value={inputValue3}
                  onChange={(e) => setInputValue3(e.target.value)}
                  required
                  placeholder="Email Address"
                  className="bg-[#263D7B0A] outline-none p-4 mt-5 w-[278px]"
                />
                <input
                  type="date"
                  name="appointment_date"
                  className="bg-[#263D7B0A] outline-none p-4 mt-5 w-[278px]"
                  required
                />
              </div>
              <div className="lg:block pb-10 lg:pb-0 flex flex-col items-center justify-center lg:space-x-5">
                <select
                  name="service"
                  className="bg-[#263D7B0A] outline-none p-4 mt-5 w-[278px]"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Service
                  </option>
                  <option value="Intracytoplasmic Sperm Injection">
                    Intracytoplasmic Sperm Injection
                  </option>
                  <option value="In-vitro Fertilization">
                    In-vitro Fertilization
                  </option>
                  <option value="Egg Donation">Egg Donation</option>
                  <option value="Intrauterine Insemination">
                    Intrauterine Insemination
                  </option>
                  <option value="Sex Selection">Sex Selection</option>
                  <option value="Sperm Donation">Sperm Donation</option>
                </select>

                <button
                  type="submit"
                  className="bg-[#E3DE65] hover:bg-[#6E2C76] hover:text-gray-100 duration-700 outline-none p-3 mt-5 float-end rounded-full text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
