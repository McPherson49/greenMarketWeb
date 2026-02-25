import React from "react";

const AboutTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Community</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">
            Welcome to the Livestock & Poultry Network - a community dedicated to sharing
            knowledge, best practices, and innovative solutions for livestock and poultry
            farming. Connect with farmers, experts, and suppliers to grow your agricultural
            business.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Community Guidelines</h3>
          <ul className="space-y-2 text-gray-700">
            {[
              "Be respectful and professional in all interactions",
              "Share accurate and helpful information",
              "No spam or self-promotion without permission",
              "Support fellow farmers and contribute positively",
            ].map((guideline, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 shrink-0">•</span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "1,234", label: "Total Members", color: "green" },
              { value: "48", label: "Subscribers", color: "blue" },
              { value: "156", label: "Posts", color: "purple" },
              { value: "892", label: "Comments", color: "orange" },
            ].map(({ value, label, color }) => (
              <div key={label} className={`bg-${color}-50 rounded-lg p-4`}>
                <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
          <p className="text-gray-700">January 15, 2024</p>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;