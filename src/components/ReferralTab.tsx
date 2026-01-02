"use client";

import { useState, useEffect } from "react";
import { Copy, Share2, Gift, Users, X, Wallet, ArrowRight, Info, CheckCircle } from "lucide-react";

interface ReferralHistory {
  id: number;
  referredUser: string;
  date: string;
  status: "Active" | "Pending";
  pointsEarned: number;
}

interface ReferralData {
  points: number;
  totalShared: number;
  successfulReferrals: number;
  referralLink: string;
  history: ReferralHistory[];
}

const ReferralTab = () => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

  // Form states
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pin, setPin] = useState("");

  // Conversion rate (example: 10 points = ₦1)
  const conversionRate = 0.1;
  const cashEquivalent = Number(withdrawAmount) * conversionRate;

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const dummyData: ReferralData = {
        points: 150,
        totalShared: 5,
        successfulReferrals: 3,
        referralLink: `${window.location.origin}/signup?ref=abc123`,
        history: [
          {
            id: 1,
            referredUser: "John Doe",
            date: "2025-12-15",
            status: "Active",
            pointsEarned: 50,
          },
          {
            id: 2,
            referredUser: "Jane Smith",
            date: "2025-12-10",
            status: "Pending",
            pointsEarned: 0,
          },
          {
            id: 3,
            referredUser: "Mike Johnson",
            date: "2025-12-05",
            status: "Active",
            pointsEarned: 100,
          },
        ],
      };
      setReferralData(dummyData);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (referralData) {
      await navigator.clipboard.writeText(referralData.referralLink);
      alert("Link copied to clipboard!");
    }
  };

  const handleShare = async () => {
    if (referralData && navigator.share) {
      try {
        await navigator.share({
          title: "Join GreenMarket",
          text: "Sign up with my referral link and start trading!",
          url: referralData.referralLink,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleWithdrawRequest = () => {
    // Basic validation
    if (
      !bankName ||
      !accountNumber ||
      !accountName ||
      !withdrawAmount ||
      !pin
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(withdrawAmount) > (referralData?.points || 0)) {
      alert("Withdrawal amount cannot exceed your points.");
      return;
    }

    alert(
      `Withdrawal request submitted!\nPoints: ${withdrawAmount}\nAmount: ₦${cashEquivalent.toFixed(2)}\nBank: ${bankName}\nAccount: ${accountNumber} (${accountName})`
    );
    setIsModalOpen(false);

    // Reset form
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setWithdrawAmount("");
    setPin("");

    // TODO: Call actual API and refresh data
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#39B54A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="text-center py-12 text-gray-600">
        No referral data yet. Start sharing your link!
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Refer & Earn</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
          <p className="text-sm text-gray-600 mb-1">Active Points</p>
          <p className="text-3xl font-bold text-emerald-700">
            {referralData.points}
          </p>
          <Gift className="w-8 h-8 text-emerald-600 mt-3" />
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Successful Referrals</p>
          <p className="text-3xl font-bold">
            {referralData.successfulReferrals}
          </p>
          <Users className="w-8 h-8 text-blue-600 mt-3" />
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Links Shared</p>
          <p className="text-3xl font-bold">{referralData.totalShared}</p>
          <Share2 className="w-8 h-8 text-purple-600 mt-3" />
        </div>
      </div>

      {/* Referral Link */}
         {/* Referral Link */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-3">Your Referral Link</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={referralData.referralLink}
            readOnly
            className="flex-1 outline-none px-4 py-2 border border-neutral-200 rounded-lg bg-white text-sm font-mono"
          />
          
          {/* Modern Copy Button */}
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(referralData.referralLink);
              // Trigger copied state
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className="relative flex items-center justify-center gap-2 px-6 py-2 bg-[#39B54A] text-white rounded-lg hover:bg-[#2d8f3a] transition-all duration-200 font-medium overflow-hidden"
          >
            <span className={`flex items-center gap-2 transition-all duration-300 ${isCopied ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
              <Copy className="w-4 h-4" />
              Copy
            </span>

            <span className={`absolute flex items-center gap-2 transition-all duration-300 ${isCopied ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              <CheckCircle className="w-4 h-4" />
              Copied!
            </span>
          </button>

          {/* Share Button (unchanged) */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Share this link with friends — earn points when they sign up and complete actions.
        </p>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-neutral-200 rounded-lg">
          <thead className="bg-gray-50 border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">
                Referred User
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">
                Points Earned
              </th>
            </tr>
          </thead>
          <tbody>
            {referralData.history.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No referrals yet. Start sharing!
                </td>
              </tr>
            ) : (
              referralData.history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4 text-sm">{item.referredUser}</td>
                  <td className="px-5 py-4 text-sm">{item.date}</td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium">
                    {item.pointsEarned}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Convert to Cash Button */}
      {referralData.points > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-[#39B54A] text-white rounded-lg hover:bg-[#188727] font-medium transition flex items-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Withdraw to Bank
        </button>
      )}

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-9999 backdrop-blur supports-backdrop-filter:bg-white/0 border-b border-neutral-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[#39B54A] to-[#2d8f3a] p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Withdrawal</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Balance Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Available Balance</p>
                    <p className="text-3xl font-bold">{referralData.points}</p>
                    <p className="text-white/60 text-xs mt-1">Reward Points</p>
                  </div>
                  <Wallet className="w-12 h-12 text-white/30" />
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter points to withdraw"
                    max={referralData.points}
                    min="0"
                    className="w-full outline-none px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#39B54A] focus:border-[#39B54A] text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    Points
                  </div>
                </div>
                
                {/* Conversion Display */}
                {withdrawAmount && (
                  <div className="mt-3 flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <span className="text-sm text-gray-600">You will receive:</span>
                    <span className="text-lg font-bold text-[#39B54A]">
                      ₦{cashEquivalent.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {/* Quick Amount Buttons */}
                <div className="flex gap-2 mt-3">
                  {[25, 50, 75, 100].map((percentage) => {
                    const amount = Math.floor((referralData.points * percentage) / 100);
                    return (
                      <button
                        key={percentage}
                        onClick={() => setWithdrawAmount(amount.toString())}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-[#39B54A] hover:text-white rounded-lg text-sm font-medium transition"
                      >
                        {percentage}%
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full outline-none px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#39B54A] focus:border-[#39B54A] bg-white appearance-none"
                >
                  <option value="">Choose your bank</option>
                  <option>Access Bank</option>
                  <option>GTBank</option>
                  <option>First Bank</option>
                  <option>Zenith Bank</option>
                  <option>UBA</option>
                  <option>Fidelity Bank</option>
                  <option>Kuda Bank</option>
                  <option>Opay</option>
                  <option>Palmpay</option>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setAccountNumber(value);
                  }}
                  placeholder="10-digit account number"
                  maxLength={10}
                  className="w-full outline-none px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#39B54A] focus:border-[#39B54A]"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Full name as on bank account"
                  className="w-full outline-none px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#39B54A] focus:border-[#39B54A]"
                />
              </div>

              {/* PIN Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="w-full outline-none px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#39B54A] focus:border-[#39B54A] text-center text-lg tracking-[0.5em] font-bold"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Processing Time</p>
                  <p className="text-blue-600">Withdrawals are processed within 24-48 hours on business days.</p>
                </div>
              </div>
            </div>

            {/* Footer with Action Button */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleWithdrawRequest}
                disabled={!bankName || !accountNumber || !accountName || !withdrawAmount || !pin}
                className="w-full py-4 bg-linear-to-r from-[#39B54A] to-[#2d8f3a] text-white rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Confirm Withdrawal
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralTab;