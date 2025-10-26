import { useState } from "react";
import { useWallet } from "../hooks/useWallet";

export default function MerchantPOS() {
  const { publicKey, isConnected } = useWallet();
  const [merchantInfo, setMerchantInfo] = useState({
    name: "Demo Pharmacy",
    category: "Healthcare",
    status: "Verified",
    totalRedemptions: 0,
    totalEarned: 0,
  });

  const [scanMode, setScanMode] = useState(false);
  const [redemptionAmount, setRedemptionAmount] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");

  const handleRedeem = async () => {
    // TODO: Implement voucher redemption
    alert("Redemption feature coming soon!");
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your Freighter wallet to access the merchant POS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">🏪 Merchant POS</h1>

      {/* Merchant Info */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-gray-500 text-sm mb-2">Merchant Name</div>
          <div className="font-bold text-lg">{merchantInfo.name}</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-gray-500 text-sm mb-2">Category</div>
          <div className="font-bold text-lg">{merchantInfo.category}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="text-green-100 text-sm mb-2">Status</div>
          <div className="font-bold text-lg">✓ {merchantInfo.status}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="text-blue-100 text-sm mb-2">Total Earned</div>
          <div className="font-bold text-xl">${merchantInfo.totalEarned}</div>
        </div>
      </div>

      {/* Redemption Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Process Voucher Redemption</h2>

        {!scanMode ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📲</div>
            <p className="text-gray-600 mb-6">
              Scan beneficiary QR code or enter their ID manually
            </p>
            <button
              onClick={() => setScanMode(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Start Scanning
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Address
              </label>
              <input
                type="text"
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                placeholder="G..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redemption Amount ($)
              </label>
              <input
                type="number"
                value={redemptionAmount}
                onChange={(e) => setRedemptionAmount(e.target.value)}
                placeholder="25.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRedeem}
                disabled={!beneficiaryId || !redemptionAmount}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                Process Redemption
              </button>
              <button
                onClick={() => setScanMode(false)}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Redemptions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Redemptions</h2>
        <div className="text-center text-gray-500 py-8">
          No redemptions yet. Start accepting vouchers!
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">
          🔍 Merchant Verification
        </h3>
        <p className="text-blue-800 text-sm mb-4">
          Your merchant status is <strong>Verified</strong>. You can now accept
          vouchers from beneficiaries.
        </p>
        <div className="text-sm text-blue-700">
          <p>✓ KYC documents verified</p>
          <p>✓ Business license validated</p>
          <p>✓ On-chain registration complete</p>
        </div>
      </div>
    </div>
  );
}
