import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { CONTRACTS, NETWORK } from "../contracts/config";
import * as StellarSdk from "@stellar/stellar-sdk";

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
                className="text-gray-700 hover:text-gray-900 transition font-semibold text-gray-900"
              >
                Leaderboard
              </Link>
              <Link
                to="/donor/impact"
                className="text-gray-700 hover:text-gray-900 transition"
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

function DonorLeaderboard() {
  const { publicKey, signTx } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState("");

  const leaderboardData = [
    {
      rank: 1,
      name: "sarah.xlm",
      impact: "$12,450",
      causes: 8,
      badge: "Covid Warrior",
      badgeIcon: "🦠",
      profileColor: "from-red-500 to-pink-600",
    },
    {
      rank: 2,
      name: "michael.xlm",
      impact: "$9,230",
      causes: 6,
      badge: "Water Messiah",
      badgeIcon: "💧",
      profileColor: "from-blue-500 to-cyan-600",
    },
    {
      rank: 3,
      name: "emma.xlm",
      impact: "$8,750",
      causes: 5,
      badge: "Education Angel",
      badgeIcon: "📚",
      profileColor: "from-purple-500 to-indigo-600",
    },
    {
      rank: 4,
      name: "david.xlm",
      impact: "$7,200",
      causes: 4,
      badge: "Food Guardian",
      badgeIcon: "🍞",
      profileColor: "from-orange-500 to-yellow-600",
    },
    {
      rank: 5,
      name: "lisa.xlm",
      impact: "$6,800",
      causes: 3,
      badge: "Shelter Savior",
      badgeIcon: "🏠",
      profileColor: "from-green-500 to-emerald-600",
    },
    {
      rank: 6,
      name: "james.xlm",
      impact: "$5,400",
      causes: 3,
      badge: "Health Hero",
      badgeIcon: "⚕️",
      profileColor: "from-teal-500 to-blue-600",
    },
    {
      rank: 7,
      name: "anna.xlm",
      impact: "$4,900",
      causes: 2,
      badge: "Climate Champion",
      badgeIcon: "🌱",
      profileColor: "from-lime-500 to-green-600",
    },
    {
      rank: 8,
      name: "robert.xlm",
      impact: "$4,200",
      causes: 2,
      badge: "Tech Titan",
      badgeIcon: "💻",
      profileColor: "from-gray-500 to-slate-600",
    },
    {
      rank: 9,
      name: "maria.xlm",
      impact: "$3,800",
      causes: 2,
      badge: "Hope Harbinger",
      badgeIcon: "🕊️",
      profileColor: "from-pink-500 to-rose-600",
    },
    {
      rank: 10,
      name: "alex.xlm",
      impact: "$3,200",
      causes: 2,
      badge: "Peace Pioneer",
      badgeIcon: "☮️",
      profileColor: "from-violet-500 to-purple-600",
    },
  ];

  const myRank = {
    rank: 983,
    name: "vedant.xlm",
    impact: "$1,150",
    causes: 4,
    badge: "Rising Star",
    badgeIcon: "⭐",
    profileColor: "from-blue-500 to-purple-600",
  };

  const handleMintBadge = async () => {
    if (!publicKey) return;

    setIsMinting(true);
    setMintStatus("Preparing mint transaction...");

    try {
      const sorobanServer = new StellarSdk.SorobanRpc.Server(NETWORK.rpcUrl, {
        allowHttp: false,
      });
      const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
      const account = await horizonServer.loadAccount(publicKey);

      const contract = new StellarSdk.Contract(CONTRACTS.DONOR_BADGE_NFT);

      const operation = contract.call(
        "mint_badge",
        StellarSdk.Address.fromString(publicKey).toScVal(),
        StellarSdk.nativeToScVal("Rising Star", { type: "string" }),
        StellarSdk.nativeToScVal(
          "A badge for new donors making their first impact",
          { type: "string" }
        ),
        StellarSdk.nativeToScVal("achievement", { type: "string" }),
        StellarSdk.nativeToScVal("common", { type: "string" })
      );

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK.networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(180)
        .build();

      setMintStatus("Simulating transaction...");
      const simulation = await sorobanServer.simulateTransaction(transaction);

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulation)) {
        console.error("Simulation error:", simulation);
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      if (!simulation.result) {
        console.error("No simulation result:", simulation);
        throw new Error("Simulation returned no result");
      }

      // Prepare the transaction with simulation results
      const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
        transaction,
        simulation
      ).build();

      setMintStatus("Please sign the transaction in your wallet...");
      const signedXdr = await signTx(preparedTx.toXDR());

      setMintStatus("Submitting to network...");
      const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(
        signedXdr,
        "base64"
      );
      const signedTx = new StellarSdk.Transaction(
        envelope,
        NETWORK.networkPassphrase
      );

      const sendResponse = await sorobanServer.sendTransaction(signedTx);
      console.log("Mint response:", sendResponse);

      setMintStatus("Transaction submitted! Waiting for confirmation...");

      // Poll for transaction result
      let attempts = 0;
      while (attempts < 20) {
        attempts++;
        try {
          const result = await sorobanServer.getTransaction(sendResponse.hash);
          if (result.status === "SUCCESS") {
            setMintStatus("✅ Badge minted successfully!");
            console.log(
              "View on explorer:",
              `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
            );
            break;
          } else if (result.status === "FAILED") {
            throw new Error("Transaction failed");
          }
        } catch (error: any) {
          if (error.message.includes("Bad union switch")) {
            console.log(
              `Poll attempt ${attempts}: Transaction still processing...`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error("Mint error:", error);
      setMintStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DonorNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">
              Impact Leaderboard
            </h1>
            <p className="text-gray-600 text-lg">
              Top humanitarian donors making a difference worldwide
            </p>
          </div>

          {publicKey ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Contributors
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {leaderboardData.map((donor) => (
                  <div
                    key={donor.rank}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-gray-400 w-8">
                          #{donor.rank}
                        </span>
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${donor.profileColor} rounded-full flex items-center justify-center`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {donor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {donor.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {donor.causes} causes supported
                          </span>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">{donor.badgeIcon}</span>
                            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                              {donor.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {donor.impact}
                      </div>
                      <div className="text-sm text-gray-600">total impact</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Your Rank Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-400 w-12">
                        #{myRank.rank}
                      </span>
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${myRank.profileColor} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white text-sm font-semibold">
                          {myRank.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {myRank.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {myRank.causes} causes supported
                        </span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{myRank.badgeIcon}</span>
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                            {myRank.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {myRank.impact}
                      </div>
                      <div className="text-sm text-gray-600">your impact</div>
                    </div>
                    <button
                      onClick={handleMintBadge}
                      disabled={isMinting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center space-x-2 disabled:opacity-50"
                    >
                      <span>🎨</span>
                      <span>{isMinting ? "Minting..." : "Mint Badge"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {mintStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-700">{mintStatus}</span>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total donors: 1,247
                  </span>
                  <span className="text-sm text-gray-600">
                    Keep donating to climb the ranks!
                  </span>
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
                  Connect your wallet to view the leaderboard and see your
                  impact ranking.
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

export default DonorLeaderboard;
