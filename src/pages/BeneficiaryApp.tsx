import { useState } from "react";
import { useWallet } from "../hooks/useWallet";

export default function BeneficiaryApp() {
  const { publicKey, isConnected } = useWallet();
  const [vouchers, setVouchers] = useState([
    { id: 1, category: "Healthcare", amount: 50, status: "Active" },
    { id: 2, category: "Food", amount: 30, status: "Active" },
  ]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your Freighter wallet to access your vouchers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">🎟️ My Vouchers</h1>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="text-gray-500 text-sm mb-2">Beneficiary ID</div>
        <div className="font-mono text-sm break-all">{publicKey}</div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">🎟️</div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {voucher.status}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{voucher.category}</h3>
            <div className="text-3xl font-bold mb-4">${voucher.amount}</div>
            <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Redeem at Merchant
            </button>
          </div>
        ))}
      </div>

      {/* Programs Available */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Available Programs</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  Healthcare Support Program
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Get vouchers for medical consultations, medicines, and
                  treatments
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                  <span className="ml-2">Funded by 12 donors</span>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                Apply
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Food Security Program</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Receive vouchers for groceries and essential food items
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                  <span className="ml-2">Funded by 8 donors</span>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                Apply
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Education Support</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Access vouchers for school supplies, books, and tuition
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                  <span className="ml-2">Funded by 5 donors</span>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption History */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">📜 Redemption History</h2>
        <div className="text-center text-gray-500 py-8">
          No redemptions yet. Start using your vouchers!
        </div>
      </div>
    </div>
  );
}
