import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import MerchantPortal from "./MerchantPortal";

function MerchantNavigation() {
  const { publicKey, connect, disconnect, isLoading } = useWallet();

  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              AidLoop
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/merchant-portal"
                className="text-gray-500 hover:text-gray-900 transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/merchant-portal/services"
                className="text-gray-500 hover:text-gray-900 transition font-medium"
              >
                My Services
              </Link>
              <Link
                to="/merchant-portal/earnings"
                className="text-gray-500 hover:text-gray-900 transition font-medium"
              >
                Earnings
              </Link>
              <Link
                to="/merchant-portal/analytics"
                className="text-gray-500 hover:text-gray-900 transition font-medium"
              >
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {publicKey ? (
              <>
                {/* Wallet Balances */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2">
                  <span className="text-sm text-gray-600">18.45 XLM</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">2.15 USDC</span>
                </div>

                {/* Deposit Button */}
                <button className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition">
                  + Deposit
                </button>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">M</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    matt.xlm
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

function MerchantApp() {
  return (
    <div className="min-h-screen bg-white">
      <MerchantNavigation />
      <MerchantPortal />
    </div>
  );
}

export default MerchantApp;
