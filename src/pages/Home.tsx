import { Link } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-100 py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-gray-200/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 text-sm font-medium text-gray-800 border border-gray-300/70">
            Built for Stellar Hackathon 2025
          </div>
          <h1 className="text-7xl md:text-8xl font-light mb-8 text-gray-900 tracking-tight">
            AidLoop
          </h1>
          <p className="text-3xl md:text-4xl mb-6 font-light text-gray-800 leading-tight">
            Yield-Powered Humanitarian Funding
          </p>
          <p className="text-xl mb-12 text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Turn your stablecoin yield into verifiable social impact.
            <span className="font-medium text-gray-900">
              {" "}
              Stake once, fund impact forever.
            </span>
          </p>

          {/* USP Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-gray-300/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <div className="text-2xl">💳</div>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">
                Keep Your Principal
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your USDC stays safe and withdrawable at any time
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-gray-300/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <div className="text-2xl">⚡</div>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">
                Yield Funds Impact
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Only generated yield funds humanitarian aid programs
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-gray-300/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <div className="text-2xl">🔗</div>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">
                On-Chain Proof
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Every impact verified with Impact Credit NFTs
              </p>
            </div>
          </div>

          {!publicKey && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-lg mx-auto shadow-lg border border-gray-300/70">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <div className="text-xl">🔗</div>
                </div>
                <p className="mb-4 font-medium text-gray-900 text-lg">
                  Connect your Freighter wallet to start making impact!
                </p>
                <p className="text-gray-700">
                  Don't have Freighter?{" "}
                  <a
                    href="https://freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    Install it here
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Problem & Solution Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                The Problem with Traditional Aid
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="text-red-500 text-xl">❌</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      High Overhead Costs
                    </h3>
                    <p className="text-gray-600">
                      Traditional NGOs spend 20-40% on administration
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-red-500 text-xl">❌</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Lack of Transparency
                    </h3>
                    <p className="text-gray-600">
                      Donors can't track where their money actually goes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-red-500 text-xl">❌</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      One-Time Impact
                    </h3>
                    <p className="text-gray-600">
                      Donations are spent once, no sustainable funding
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-4xl font-bold mb-6">AidLoop's Solution</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-300 text-xl">✅</div>
                  <div>
                    <h3 className="font-semibold">Zero Overhead</h3>
                    <p className="text-green-100">
                      Smart contracts eliminate administrative costs
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-300 text-xl">✅</div>
                  <div>
                    <h3 className="font-semibold">Full Transparency</h3>
                    <p className="text-green-100">
                      Every transaction and impact verified on-chain
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-300 text-xl">✅</div>
                  <div>
                    <h3 className="font-semibold">Perpetual Impact</h3>
                    <p className="text-green-100">
                      Yield generates ongoing funding forever
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            How AidLoop Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, transparent process that turns your stablecoin yield into
            verifiable humanitarian impact
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Donor Card */}
          <Link to="/donor" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-300/60">
              <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <div className="text-3xl">💳</div>
              </div>
              <h3 className="text-2xl font-medium mb-6 text-gray-900 text-center">
                For Donors
              </h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-center">
                Deposit USDC into our yield vault. Your principal stays safe,
                only generated yield funds humanitarian aid.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Keep your principal
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Withdraw anytime
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Track your impact
                  </span>
                </div>
              </div>
              <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium group-hover:bg-gray-800 transition text-center">
                Start Donating →
              </div>
            </div>
          </Link>

          {/* Merchant Card */}
          <Link to="/merchant-portal" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-300/60">
              <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                <div className="text-3xl">🏥</div>
              </div>
              <h3 className="text-2xl font-medium mb-6 text-gray-900 text-center">
                For Service Providers
              </h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-center">
                Register as a humanitarian service provider. Submit proof of
                service delivery and get paid from the yield pool.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Easy registration
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Submit proof of service
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Get paid from yield
                  </span>
                </div>
              </div>
              <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium group-hover:bg-gray-800 transition text-center">
                Register Now →
              </div>
            </div>
          </Link>

          {/* Impact Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-gray-300/60">
            <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center mb-8 mx-auto">
              <div className="text-3xl">🌐</div>
            </div>
            <h3 className="text-2xl font-medium mb-6 text-gray-900 text-center">
              Real Impact
            </h3>
            <p className="text-gray-700 mb-8 leading-relaxed text-center">
              Every verified service mints an Impact Credit NFT, providing
              transparent, on-chain proof of humanitarian impact.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  On-chain verification
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Impact Credit NFTs
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Transparent tracking
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The Loop */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            The AidLoop Cycle ♻️
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Donor Deposits</h3>
              <p className="text-sm text-gray-600">USDC → Yield Vault</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-800 mb-2">DeFi Yield</h3>
              <p className="text-sm text-gray-600">Blend/Soroswap</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Service Delivery</h3>
              <p className="text-sm text-gray-600">Merchant Helps</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Proof Submitted</h3>
              <p className="text-sm text-gray-600">IPFS + Contract</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                5
              </div>
              <h3 className="font-bold text-gray-800 mb-2">NFT Minted</h3>
              <p className="text-sm text-gray-600">Impact Credit</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                6
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Merchant Paid</h3>
              <p className="text-sm text-gray-600">From Yield Pool</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white mb-16">
          <h2 className="text-4xl font-bold mb-6">Ready to Make Impact?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join the future of humanitarian funding. Your stablecoin yield can
            change lives while keeping your principal safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
            >
              Start Donating
            </Link>
            <Link
              to="/merchant-portal"
              className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition border border-blue-400"
            >
              Register as Provider
            </Link>
          </div>
        </div>

        {/* Technical Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Built on Stellar & Soroban
            </h2>
            <p className="text-gray-300 text-lg">
              Fully decentralized, transparent, and auditable humanitarian
              funding protocol
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-bold text-purple-400 mb-2">ImpactVault</h3>
              <p className="text-sm text-gray-300">
                Secure yield vault for donor funds
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="font-bold text-blue-400 mb-2">MerchantRegistry</h3>
              <p className="text-sm text-gray-300">
                Verified service provider network
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🎫</div>
              <h3 className="font-bold text-green-400 mb-2">ImpactContract</h3>
              <p className="text-sm text-gray-300">
                Proof validation & yield distribution
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="font-bold text-indigo-400 mb-2">
                ImpactCreditNFT
              </h3>
              <p className="text-sm text-gray-300">On-chain proof of impact</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">
              All contracts are live on Stellar Testnet and ready for testing
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                ✅ Deployed
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                ✅ Tested
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                ✅ Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
