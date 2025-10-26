// No longer need useState for error handling
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { WalletProvider, useWallet } from "./hooks/useWallet";
import DonorApp from "./pages/DonorApp";
import DonorLeaderboard from "./pages/DonorLeaderboard";
import DonorImpact from "./pages/DonorImpact";
import MerchantApp from "./pages/MerchantApp";
import BeneficiaryApp from "./pages/BeneficiaryApp";
import MerchantPOS from "./pages/MerchantPOS";
import Home from "./pages/Home";
import DiagnosticPage from "./pages/DiagnosticPage";

function Navigation() {
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
                Donors
              </Link>
              <Link
                to="/merchant-portal"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Service Providers
              </Link>
              <Link
                to="/beneficiary"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Beneficiaries
              </Link>
              <Link
                to="/merchant"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                POS
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

function App() {
  return (
    <Router>
      <WalletProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navigation />
                  <Home />
                </>
              }
            />
            <Route path="/donor" element={<DonorApp />} />
            <Route path="/donor/leaderboard" element={<DonorLeaderboard />} />
            <Route path="/donor/impact" element={<DonorImpact />} />
            <Route path="/merchant-portal" element={<MerchantApp />} />
            <Route
              path="/beneficiary"
              element={
                <>
                  <Navigation />
                  <BeneficiaryApp />
                </>
              }
            />
            <Route
              path="/merchant"
              element={
                <>
                  <Navigation />
                  <MerchantPOS />
                </>
              }
            />
            <Route
              path="/diagnostic"
              element={
                <>
                  <Navigation />
                  <DiagnosticPage />
                </>
              }
            />
          </Routes>
        </div>
      </WalletProvider>
    </Router>
  );
}

export default App;
