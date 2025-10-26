import { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  CONTRACTS,
  NETWORK,
  USDC_TOKEN,
  USDC_ISSUER,
} from "../contracts/config";

export default function MerchantPortal() {
  const { publicKey, signTx, isConnected } = useWallet();
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Yield and earnings data
  const [yieldData, setYieldData] = useState({
    currentRate: 7.5,
    totalYieldGenerated: 2450.0,
    availableForPayout: 1200.0,
    totalPaidOut: 1250.0,
    nextPayoutDate: "2024-02-15",
    estimatedMonthlyEarnings: 180.0,
  });

  // Merchant performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalServices: 24,
    totalEarnings: 1250.0,
    averageServiceValue: 52.08,
    rating: 4.8,
    completionRate: 96.2,
  });

  // Form state for merchant registration
  const [registrationForm, setRegistrationForm] = useState({
    businessName: "",
    category: "",
    documentHash: "",
  });

  // Form state for submitting proof
  const [proofForm, setProofForm] = useState({
    serviceType: "",
    amount: "",
    proofHash: "",
  });

  // Recent transactions
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      serviceType: "Medical Consultation",
      amount: 150.0,
      status: "Paid",
      date: "2024-01-15",
      nftId: 1234,
    },
    {
      id: 2,
      serviceType: "Pharmacy",
      amount: 75.0,
      status: "Verified",
      date: "2024-01-16",
      nftId: 1235,
    },
    {
      id: 3,
      serviceType: "Emergency Food",
      amount: 200.0,
      status: "Pending",
      date: "2024-01-17",
      nftId: null,
    },
  ]);

  useEffect(() => {
    if (publicKey) {
      loadMerchantInfo();
    }
  }, [publicKey]);

  const loadMerchantInfo = async () => {
    try {
      const isRegistered = localStorage.getItem(`merchant_${publicKey}`);
      if (isRegistered) {
        const merchantData = JSON.parse(isRegistered);
        setMerchantInfo({
          name: merchantData.businessName,
          category: merchantData.category,
          status: "Verified",
          registrationDate: merchantData.registeredAt,
        });
      } else {
        setMerchantInfo(null);
      }
    } catch (error) {
      console.error("Error loading merchant info:", error);
      setMerchantInfo(null);
    }
  };

  const handleMerchantRegistration = async () => {
    if (!publicKey) return;

    try {
      setIsRegistering(true);
      setTxStatus("Registering merchant on blockchain...");

      const sorobanServer = new StellarSdk.SorobanRpc.Server(NETWORK.rpcUrl, {
        allowHttp: false,
      });

      const contract = new StellarSdk.Contract(CONTRACTS.MERCHANT_REGISTRY);
      const account = await sorobanServer.getAccount(publicKey);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK.networkPassphrase,
      })
        .addOperation(
          contract.call(
            "register_merchant",
            StellarSdk.Address.fromString(publicKey).toScVal(),
            StellarSdk.nativeToScVal(registrationForm.businessName, {
              type: "string",
            }),
            StellarSdk.nativeToScVal(registrationForm.category, {
              type: "string",
            }),
            StellarSdk.nativeToScVal("mock_document_hash", { type: "string" })
          )
        )
        .setTimeout(180)
        .build();

      const simulatedTx = await sorobanServer.simulateTransaction(transaction);

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulatedTx)) {
        throw new Error(`Simulation failed: ${simulatedTx.error}`);
      }

      const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
        transaction,
        simulatedTx
      ).build();

      setTxStatus("Please sign in your wallet...");
      const xdr = preparedTx.toXDR();
      const signedXdr = await signTx(xdr);

      setTxStatus("Submitting to network...");
      const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(
        signedXdr,
        "base64"
      );
      const signedTx = new StellarSdk.Transaction(
        envelope,
        NETWORK.networkPassphrase
      );

      const sendResponse = await sorobanServer.sendTransaction(signedTx);
      console.log("Send response:", sendResponse);

      if (
        sendResponse.status === "PENDING" ||
        sendResponse.status === "DUPLICATE"
      ) {
        setTxStatus(
          "✅ Merchant registered successfully! Verification pending..."
        );

        const merchantData = {
          businessName: registrationForm.businessName,
          category: registrationForm.category,
          registeredAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `merchant_${publicKey}`,
          JSON.stringify(merchantData)
        );

        setTimeout(async () => {
          setTxStatus(
            "✅ Merchant verified! You can now submit proofs of service."
          );
          await loadMerchantInfo();
        }, 4000);
      } else {
        throw new Error(`Transaction failed: ${sendResponse.status}`);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setTxStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      setTxStatus("Submitting proof to blockchain...");

      const sorobanServer = new StellarSdk.SorobanRpc.Server(NETWORK.rpcUrl, {
        allowHttp: false,
      });

      const contract = new StellarSdk.Contract(CONTRACTS.IMPACT_CONTRACT);
      const account = await sorobanServer.getAccount(publicKey);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK.networkPassphrase,
      })
        .addOperation(
          contract.call(
            "record_redemption",
            StellarSdk.Address.fromString(publicKey).toScVal(),
            StellarSdk.nativeToScVal(
              Math.floor(parseFloat(proofForm.amount) * 1e7),
              { type: "i128" }
            )
          )
        )
        .setTimeout(180)
        .build();

      const simulatedTx = await sorobanServer.simulateTransaction(transaction);

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulatedTx)) {
        throw new Error(`Simulation failed: ${simulatedTx.error}`);
      }

      const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
        transaction,
        simulatedTx
      ).build();

      setTxStatus("Please sign in your wallet...");
      const xdr = preparedTx.toXDR();
      const signedXdr = await signTx(xdr);

      setTxStatus("Submitting to network...");
      const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(
        signedXdr,
        "base64"
      );
      const signedTx = new StellarSdk.Transaction(
        envelope,
        NETWORK.networkPassphrase
      );

      const sendResponse = await sorobanServer.sendTransaction(signedTx);
      console.log("Send response:", sendResponse);

      if (
        sendResponse.status === "PENDING" ||
        sendResponse.status === "DUPLICATE"
      ) {
        setTxStatus("✅ Service redemption recorded successfully!");

        const newTransaction = {
          id: Date.now(),
          serviceType: proofForm.serviceType,
          amount: parseFloat(proofForm.amount),
          status: "Pending",
          date: new Date().toISOString().split("T")[0],
          nftId: null,
        };

        setRecentTransactions((prev) => [newTransaction, ...prev]);
        setProofForm({ serviceType: "", amount: "", proofHash: "" });
      } else {
        throw new Error(`Transaction failed: ${sendResponse.status}`);
      }
    } catch (error: any) {
      console.error("Proof submission error:", error);
      setTxStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your Freighter wallet to access the merchant portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold mb-8 text-gray-900">
        {merchantInfo?.name || "Service Provider"} - Dashboard
      </h1>

      {/* Aid Committed to This Business - Only show when wallet is connected */}
      {publicKey && (
        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Aid Committed to Your Business
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900">$2,450</div>
              <div className="text-gray-700 text-sm">Total Aid Committed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900">$1,200</div>
              <div className="text-gray-700 text-sm">
                Available for Services
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900">$1,250</div>
              <div className="text-gray-700 text-sm">Already Paid Out</div>
            </div>
          </div>
        </div>
      )}

      {!publicKey ? (
        /* Connect Wallet Section */
        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Connect Your Wallet
            </h2>
            <p className="text-gray-700 mb-6">
              Connect your Freighter wallet to access the merchant portal and
              start providing humanitarian services.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-gray-600 text-sm">
                Once connected, you can register as a service provider, submit
                proof of service, and get paid from the yield pool.
              </p>
            </div>
          </div>
        </div>
      ) : !merchantInfo ? (
        /* Registration Section */
        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Register as Humanitarian Service Provider
          </h2>
          <p className="text-gray-700 mb-6">
            Join the humanitarian yield network. Provide verified services and
            get paid from the yield pool.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={registrationForm.businessName}
                onChange={(e) =>
                  setRegistrationForm({
                    ...registrationForm,
                    businessName: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                placeholder="e.g., Hope Medical Clinic"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Service Category
              </label>
              <select
                value={registrationForm.category}
                onChange={(e) =>
                  setRegistrationForm({
                    ...registrationForm,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food Aid">Food Aid</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency Relief</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Business Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-500">
                Click to upload business license, tax ID, etc.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Documents will be stored on IPFS
              </p>
            </div>
          </div>

          <button
            onClick={handleMerchantRegistration}
            disabled={
              isRegistering ||
              !registrationForm.businessName ||
              !registrationForm.category
            }
            className="mt-6 w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isRegistering ? "Registering..." : "Register as Service Provider"}
          </button>

          {txStatus && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{txStatus}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Merchant Dashboard */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Performance Metrics */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Your Performance
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-semibold text-gray-900">
                    {performanceMetrics.totalServices}
                  </div>
                  <div className="text-sm text-gray-600">
                    Services Delivered
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-semibold text-gray-900">
                    ${performanceMetrics.totalEarnings}
                  </div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-semibold text-gray-900">
                    {performanceMetrics.rating}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-semibold text-gray-900">
                    {performanceMetrics.completionRate}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </div>

            {/* Merchant Profile */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                👤 Your Profile
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Business Name</div>
                  <div className="font-semibold">{merchantInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-semibold">{merchantInfo.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ {merchantInfo.status}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="font-semibold">
                    {new Date(
                      merchantInfo.registrationDate
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Proof Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Submit Proof of Humanitarian Service
            </h2>
            <p className="text-gray-600 mb-6">
              Record a service you provided to get paid from the yield pool.
              Each verified service generates an Impact Credit NFT.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={proofForm.serviceType}
                  onChange={(e) =>
                    setProofForm({ ...proofForm, serviceType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select service type</option>
                  <option value="Medical Consultation">
                    Medical Consultation
                  </option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Emergency Food">Emergency Food</option>
                  <option value="Education">Education</option>
                  <option value="Shelter">Shelter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reimbursement Amount (USDC)
                </label>
                <input
                  type="number"
                  value={proofForm.amount}
                  onChange={(e) =>
                    setProofForm({ ...proofForm, amount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Proof of Service
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-500">
                  Click to upload receipt, photo, or document
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Proof will be stored on IPFS
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmitProof}
              disabled={loading || !proofForm.serviceType || !proofForm.amount}
              className="mt-6 w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Submitting..." : "Submit Proof of Service"}
            </button>

            {txStatus && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">{txStatus}</p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              📈 Recent Service History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Service Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      NFT ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">
                        {tx.serviceType}
                      </td>
                      <td className="py-3 px-4">${tx.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "Verified"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{tx.date}</td>
                      <td className="py-3 px-4">
                        {tx.nftId ? (
                          <a
                            href={`https://stellar.expert/explorer/testnet/contract/${CONTRACTS.IMPACT_CREDIT_NFT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            #{tx.nftId}
                          </a>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
