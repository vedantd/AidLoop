import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

function DonorNavigation() {
  const { publicKey, connect, disconnect, isLoading } = useWallet();

  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-semibold text-gray-900">
              AidLoop
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/donor"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Impact Hub
              </Link>
              <Link
                to="/donor/leaderboard"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Leaderboard
              </Link>
              <Link
                to="/donor/impact"
                className="text-gray-700 hover:text-gray-900 transition font-semibold text-gray-900"
              >
                My Impact NFT
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {publicKey ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">V</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    vedant.xlm
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connect}
                disabled={isLoading}
                className="bg-gray-900 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DonorImpact() {
  const { publicKey } = useWallet();

  const impactHistory = [
    {
      id: 1,
      cause: "Nepal Earthquake Relief",
      amount: "$500",
      date: "2024-01-15",
      status: "Completed",
      impact: "Funded emergency shelter for 12 families",
    },
    {
      id: 2,
      cause: "Healthcare Access",
      amount: "$300",
      date: "2024-01-10",
      status: "Completed",
      impact: "Provided medical care for 8 patients",
    },
    {
      id: 3,
      cause: "Education Support",
      amount: "$200",
      date: "2024-01-05",
      status: "Completed",
      impact: "Supplied school materials for 15 students",
    },
    {
      id: 4,
      cause: "Food Security",
      amount: "$150",
      date: "2024-01-01",
      status: "Completed",
      impact: "Delivered meals to 25 families",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <DonorNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">
              My Impact Story
            </h1>
            <p className="text-gray-600 text-lg">
              Track your humanitarian contributions and their real-world impact
            </p>
          </div>

          {publicKey ? (
            <div className="space-y-8">
              {/* Impact Summary */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Impact Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      $1,150
                    </div>
                    <div className="text-gray-600">Total Donated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      4
                    </div>
                    <div className="text-gray-600">Causes Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      60+
                    </div>
                    <div className="text-gray-600">Lives Impacted</div>
                  </div>
                </div>
              </div>

              {/* Impact History */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Impact History
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {impactHistory.map((impact) => (
                    <div key={impact.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {impact.cause}
                          </h3>
                          <p className="text-gray-600 mb-2">{impact.impact}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{impact.date}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {impact.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {impact.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Certificates */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Impact Certificates
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Humanitarian Donor Certificate
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Verified impact across 4 humanitarian causes
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download PDF
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Impact NFT Collection
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      On-chain proof of your humanitarian impact
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to view your impact history and
                  certificates.
                </p>
                <button className="bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                  Connect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorImpact;
