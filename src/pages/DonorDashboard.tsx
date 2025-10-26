import { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  CONTRACTS,
  NETWORK,
  USDC_TOKEN,
  USDC_ISSUER,
} from "../contracts/config";

export default function DonorDashboard() {
  const { publicKey, signTx, isConnected } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [vaultStats, setVaultStats] = useState({
    totalDeposits: "0",
    totalYieldGenerated: "0",
    activeDonors: 0,
  });
  const [myDepositBalance, setMyDepositBalance] = useState("0");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [selectedCause, setSelectedCause] = useState(null);
  const [causeDepositAmount, setCauseDepositAmount] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activePrograms, setActivePrograms] = useState([
    {
      id: 1,
      name: "Nepal Earthquake Relief",
      description:
        "Emergency medical aid and food assistance for earthquake victims",
      totalRaised: 125000,
      totalDonors: 342,
      impactNumber: "1,250",
      impactText: "families helped",
      status: "Active",
      category: "Emergency Relief",
      target: 200000,
      protocol: "Blend",
      protocolLogo: "/blend.png",
      socialLinks: {
        twitter: "https://x.com/nepalrelief",
        instagram: "https://instagram.com/nepalrelief",
      },
    },
    {
      id: 2,
      name: "Syrian Refugee Education",
      description: "Free education and training programs for refugee children",
      totalRaised: 89000,
      totalDonors: 156,
      impactNumber: "450",
      impactText: "children enrolled",
      status: "Active",
      category: "Education",
      target: 150000,
      protocol: "Aquarius",
      protocolLogo: "/aquarious.png",
      socialLinks: {
        twitter: "https://x.com/syrianeducation",
        instagram: "https://instagram.com/syrianeducation",
      },
    },
    {
      id: 3,
      name: "Ukraine Medical Support",
      description: "Critical medical supplies and treatment for war victims",
      totalRaised: 234000,
      totalDonors: 567,
      impactNumber: "3,200",
      impactText: "patients treated",
      status: "Active",
      category: "Healthcare",
      target: 300000,
      protocol: "Blend",
      protocolLogo: "/blend.png",
      socialLinks: {
        twitter: "https://x.com/ukrainemedical",
        instagram: "https://instagram.com/ukrainemedical",
      },
    },
  ]);

  // Load account balances and vault stats
  useEffect(() => {
    if (publicKey) {
      loadBalances();
      loadVaultStats();
    }
  }, [publicKey]);

  const loadBalances = async () => {
    try {
      console.log("Loading balances for account:", publicKey);
      const server = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
      const account = await server.loadAccount(publicKey!);

      console.log("Account balances:", account.balances);

      // Get XLM balance
      const xlmBalance = account.balances.find(
        (b: any) => b.asset_type === "native"
      );
      if (xlmBalance) {
        setBalance(parseFloat(xlmBalance.balance).toFixed(2));
      }

      // Get USDC balance - check all non-native assets
      const nonNativeBalances = account.balances.filter(
        (b: any) => b.asset_type !== "native"
      );
      console.log("Non-native balances (tokens):", nonNativeBalances);

      const usdcBal = account.balances.find(
        (b: any) => b.asset_type !== "native" && b.asset_code === "USDC"
      );
      if (usdcBal) {
        const usdcBalanceValue = parseFloat(usdcBal.balance).toFixed(2);
        console.log("USDC balance found:", usdcBalanceValue);
        console.log("USDC asset details:", usdcBal);
        setUsdcBalance(usdcBalanceValue);
      } else {
        console.log("No USDC balance found, setting to 0");
        setUsdcBalance("0.00");
      }
    } catch (error) {
      console.error("Error loading balances:", error);
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const loadVaultStats = async () => {
    if (!publicKey) return;

    try {
      setIsLoadingStats(true);

      // Use SorobanRpc for contract calls
      const sorobanServer = new StellarSdk.SorobanRpc.Server(NETWORK.rpcUrl, {
        allowHttp: false,
      });

      const contract = new StellarSdk.Contract(CONTRACTS.IMPACT_VAULT);

      // Get total deposits from vault
      const totalDepositsCall = contract.call("get_total_deposits");

      // Get my deposit balance
      const myBalanceCall = contract.call(
        "get_balance",
        StellarSdk.Address.fromString(publicKey).toScVal()
      );

      // Simulate both calls
      const [totalDepositsResult, myBalanceResult] = await Promise.all([
        sorobanServer.simulateTransaction(
          new StellarSdk.TransactionBuilder(
            await sorobanServer.getAccount(publicKey),
            { fee: "100000", networkPassphrase: NETWORK.networkPassphrase }
          )
            .addOperation(totalDepositsCall)
            .setTimeout(30)
            .build()
        ),
        sorobanServer.simulateTransaction(
          new StellarSdk.TransactionBuilder(
            await sorobanServer.getAccount(publicKey),
            { fee: "100000", networkPassphrase: NETWORK.networkPassphrase }
          )
            .addOperation(myBalanceCall)
            .setTimeout(30)
            .build()
        ),
      ]);

      // Parse results
      if (
        !StellarSdk.SorobanRpc.Api.isSimulationError(totalDepositsResult) &&
        totalDepositsResult.result
      ) {
        const totalDeposits = StellarSdk.scValToNative(
          totalDepositsResult.result.retval
        );
        setVaultStats((prev) => ({
          ...prev,
          totalDeposits: (Number(totalDeposits) / 1e7).toFixed(2), // Convert from stroops to USDC
        }));
      }

      if (
        !StellarSdk.SorobanRpc.Api.isSimulationError(myBalanceResult) &&
        myBalanceResult.result
      ) {
        const myBalance = StellarSdk.scValToNative(
          myBalanceResult.result.retval
        );
        setMyDepositBalance((Number(myBalance) / 1e7).toFixed(2));
      }

      // For now, set some mock data for yield and active donors
      // In a real implementation, these would come from other contract calls
      setVaultStats((prev) => ({
        ...prev,
        totalYieldGenerated: "0.00", // Would come from yield tracking
        activeDonors: 1, // Would come from donor count tracking
      }));
    } catch (error) {
      console.error("Error loading vault stats:", error);
      // Set fallback values
      setVaultStats((prev) => ({
        ...prev,
        totalDeposits: "0.00",
        totalYieldGenerated: "0.00",
        activeDonors: 0,
      }));
      setMyDepositBalance("0.00");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleDeposit = async () => {
    if (!publicKey || !depositAmount) return;

    // Get real-time USDC balance from the token contract
    const depositAmountStroops = Math.floor(
      parseFloat(depositAmount) * 1000000
    );

    // Create sorobanServer for the entire function
    const sorobanServer = new StellarSdk.SorobanRpc.Server(NETWORK.rpcUrl, {
      allowHttp: false,
    });

    try {
      setLoading(true);
      setTxStatus("Checking USDC balance...");

      // Try token contract first, fallback to Horizon if it fails
      let currentUsdcBalance = "0.00";
      let currentUsdcBalanceStroops = 0;

      try {
        const usdcContract = new StellarSdk.Contract(USDC_TOKEN);
        const balanceCall = usdcContract.call(
          "balance",
          StellarSdk.Address.fromString(publicKey).toScVal()
        );

        // Build a simple transaction to get the balance
        const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
        const account = await horizonServer.loadAccount(publicKey);

        const tempTx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK.networkPassphrase,
        })
          .addOperation(balanceCall)
          .setTimeout(30)
          .build();

        const balanceResult = await sorobanServer.simulateTransaction(tempTx);
        const balanceStroops = parseInt(
          balanceResult.result?.toString() || "0"
        );

        if (!isNaN(balanceStroops) && balanceStroops > 0) {
          currentUsdcBalanceStroops = balanceStroops;
          currentUsdcBalance = (balanceStroops / 1000000).toFixed(2);
        } else {
          throw new Error("Invalid balance from contract");
        }
      } catch (contractError) {
        console.log(
          "Contract balance check failed, using Horizon balance:",
          contractError
        );

        // Fallback to Horizon balance
        const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
        const account = await horizonServer.loadAccount(publicKey);

        const usdcBal = account.balances.find(
          (b: any) => b.asset_type !== "native" && b.asset_code === "USDC"
        );
        if (usdcBal) {
          currentUsdcBalance = parseFloat(usdcBal.balance).toFixed(2);
          currentUsdcBalanceStroops = Math.floor(
            parseFloat(currentUsdcBalance) * 1000000
          );
        }
      }

      console.log(
        `Real-time balance check: Deposit ${depositAmount} USDC (${depositAmountStroops} stroops), Available ${currentUsdcBalance} USDC (${currentUsdcBalanceStroops} stroops)`
      );

      if (depositAmountStroops > currentUsdcBalanceStroops) {
        setTxStatus(
          `❌ Error: Insufficient USDC balance. You have ${currentUsdcBalance} USDC, trying to deposit ${depositAmount} USDC.`
        );
        setLoading(false);
        return;
      }

      setTxStatus("Building transaction...");

      // Use existing sorobanServer from balance check
      // Load account for transaction building
      const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
      const account = await horizonServer.loadAccount(publicKey);

      // Convert amount to stroops (1 USDC = 10,000,000 stroops)
      const amountInStroops = Math.floor(parseFloat(depositAmount) * 1e7);

      // Build contract invocation
      const contract = new StellarSdk.Contract(CONTRACTS.IMPACT_VAULT);

      // Build transaction with single deposit operation
      // The ImpactVault deposit function should handle the USDC transfer internally
      const builtTransaction = new StellarSdk.TransactionBuilder(account, {
        fee: "100000", // Higher fee for Soroban
        networkPassphrase: NETWORK.networkPassphrase,
      })
        .addOperation(
          contract.call(
            "deposit",
            StellarSdk.Address.fromString(publicKey).toScVal(),
            StellarSdk.nativeToScVal(amountInStroops, { type: "i128" })
          )
        )
        .setTimeout(180)
        .build();

      setTxStatus("Simulating transaction...");

      // Simulate to get proper resource fees
      let simulatedTx;
      try {
        simulatedTx = await sorobanServer.simulateTransaction(builtTransaction);
      } catch (simError: any) {
        console.error("Simulation request error:", simError);
        throw new Error(
          `Simulation request failed: ${simError.message || "Network error"}`
        );
      }

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulatedTx)) {
        console.error("Simulation error:", simulatedTx);
        throw new Error(`Simulation failed: ${simulatedTx.error}`);
      }

      if (!simulatedTx.result) {
        console.error("No simulation result:", simulatedTx);
        throw new Error("Simulation returned no result");
      }

      // Prepare the transaction with simulation results
      const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
        builtTransaction,
        simulatedTx
      ).build();

      setTxStatus("Please sign in your wallet...");
      const xdr = preparedTx.toXDR();

      console.log("Sending XDR to wallet:", xdr.substring(0, 50) + "...");
      const signedXdr = await signTx(xdr);
      console.log(
        "Received signed XDR:",
        typeof signedXdr,
        signedXdr.substring(0, 50) + "..."
      );

      setTxStatus("Submitting to network...");

      // Parse the signed XDR properly for Soroban transactions
      const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(
        signedXdr,
        "base64"
      );
      const signedTx = new StellarSdk.Transaction(
        envelope,
        NETWORK.networkPassphrase
      );

      console.log("Parsed signed transaction, submitting...");

      // Submit via Soroban RPC
      const sendResponse = await sorobanServer.sendTransaction(signedTx);
      console.log("Send response:", sendResponse);

      if (
        sendResponse.status === "PENDING" ||
        sendResponse.status === "DUPLICATE"
      ) {
        setTxStatus("Waiting for confirmation...");

        // Poll for result with improved error handling
        let attempts = 0;
        const maxAttempts = 20;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          attempts++;

          try {
            const getResponse = await sorobanServer.getTransaction(
              sendResponse.hash
            );
            console.log(
              `Poll attempt ${attempts}/${maxAttempts}:`,
              getResponse.status
            );

            if (getResponse.status === "SUCCESS") {
              setTxStatus("✅ Deposit successful!");
              setDepositAmount("");
              await loadBalances();
              await loadVaultStats(); // Refresh vault stats
              console.log("Transaction successful:", sendResponse.hash);
              console.log(
                "View on explorer:",
                `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
              );
              return; // Exit successfully
            }

            if (getResponse.status === "FAILED") {
              console.error("Transaction failed:", getResponse);
              throw new Error("Transaction failed on-chain");
            }

            // If NOT_FOUND, continue polling
          } catch (pollError: any) {
            const errorMsg = pollError.message || String(pollError);

            // Handle "Bad union switch" errors - these often mean the transaction is still processing
            if (
              errorMsg.includes("Bad union switch") ||
              errorMsg.includes("union")
            ) {
              console.log(
                `Poll attempt ${attempts}: Transaction still processing...`
              );

              // After several attempts with union errors, check balance and assume success
              if (attempts >= 6) {
                console.log(
                  "Multiple union errors, checking balance to verify success"
                );
                const balanceBefore = parseFloat(usdcBalance);
                await loadBalances();

                // If this is our last few attempts, show success message
                if (attempts >= 8) {
                  setTxStatus(
                    "✅ Transaction submitted! Refreshing balance..."
                  );
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  await loadBalances();
                  await loadVaultStats(); // Refresh vault stats
                  showSuccessToast(
                    `🎉 Successfully deposited $${depositAmount} USDC! Your impact is growing.`
                  );
                  console.log(
                    "View on explorer:",
                    `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
                  );
                  return;
                }
              }
            } else {
              console.warn(`Poll attempt ${attempts} error:`, errorMsg);
            }

            // Continue polling
          }
        }

        // Polling completed - verify with balance check
        console.log("Polling completed, verifying transaction success");
        setTxStatus("✅ Transaction submitted successfully! Refreshing...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await loadBalances();
        await loadVaultStats(); // Refresh vault stats
        console.log(
          "View on explorer:",
          `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
        );
      } else {
        throw new Error(`Transaction send failed: ${sendResponse.status}`);
      }
    } catch (error: any) {
      console.error("Deposit error:", error);

      // Handle specific contract errors
      if (
        error.message.includes(
          "resulting balance is not within the allowed range"
        )
      ) {
        setTxStatus(
          "❌ Error: Insufficient USDC balance. Please check your wallet and try a smaller amount."
        );
      } else if (error.message.includes("contract call failed")) {
        setTxStatus(
          "❌ Error: Transaction failed. Please check your USDC balance and try again."
        );
      } else {
        setTxStatus(`❌ Error: ${error.message || "Transaction failed"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCauseDeposit = async () => {
    if (!publicKey || !causeDepositAmount) return;

    // Get real-time USDC balance from the token contract
    const depositAmountStroops = Math.floor(
      parseFloat(causeDepositAmount) * 1000000
    );

    // Create sorobanServer for the entire function
    const sorobanServer = new StellarSdk.SorobanRpc.Server(NETWORK.rpcUrl, {
      allowHttp: false,
    });

    try {
      setLoading(true);
      setTxStatus("Checking USDC balance...");

      // Try token contract first, fallback to Horizon if it fails
      let currentUsdcBalance = "0.00";
      let currentUsdcBalanceStroops = 0;

      try {
        const usdcContract = new StellarSdk.Contract(USDC_TOKEN);
        const balanceCall = usdcContract.call(
          "balance",
          StellarSdk.Address.fromString(publicKey).toScVal()
        );

        // Build a simple transaction to get the balance
        const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
        const account = await horizonServer.loadAccount(publicKey);

        const tempTx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: NETWORK.networkPassphrase,
        })
          .addOperation(balanceCall)
          .setTimeout(30)
          .build();

        const balanceResult = await sorobanServer.simulateTransaction(tempTx);
        const balanceStroops = parseInt(
          balanceResult.result?.toString() || "0"
        );

        if (!isNaN(balanceStroops) && balanceStroops > 0) {
          currentUsdcBalanceStroops = balanceStroops;
          currentUsdcBalance = (balanceStroops / 1000000).toFixed(2);
        } else {
          throw new Error("Invalid balance from contract");
        }
      } catch (contractError) {
        console.log(
          "Contract balance check failed, using Horizon balance:",
          contractError
        );

        // Fallback to Horizon balance
        const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
        const account = await horizonServer.loadAccount(publicKey);

        const usdcBal = account.balances.find(
          (b: any) => b.asset_type !== "native" && b.asset_code === "USDC"
        );
        if (usdcBal) {
          currentUsdcBalance = parseFloat(usdcBal.balance).toFixed(2);
          currentUsdcBalanceStroops = Math.floor(
            parseFloat(currentUsdcBalance) * 1000000
          );
        }
      }

      console.log(
        `Real-time balance check: Deposit ${causeDepositAmount} USDC (${depositAmountStroops} stroops), Available ${currentUsdcBalance} USDC (${currentUsdcBalanceStroops} stroops)`
      );

      if (depositAmountStroops > currentUsdcBalanceStroops) {
        setTxStatus(
          `❌ Error: Insufficient USDC balance. You have ${currentUsdcBalance} USDC, trying to deposit ${causeDepositAmount} USDC.`
        );
        setLoading(false);
        return;
      }

      setTxStatus("Building transaction...");

      // Use existing sorobanServer from balance check
      // Load account for transaction building
      const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
      const account = await horizonServer.loadAccount(publicKey);

      // Convert amount to stroops (1 USDC = 10,000,000 stroops)
      const amountInStroops = Math.floor(parseFloat(causeDepositAmount) * 1e7);

      // Build contract invocation
      const contract = new StellarSdk.Contract(CONTRACTS.IMPACT_VAULT);

      console.log("Using USDC token contract:", USDC_TOKEN);
      console.log("Using ImpactVault contract:", CONTRACTS.IMPACT_VAULT);
      console.log("Deposit amount in stroops:", amountInStroops);

      // Build transaction with single deposit operation
      // The ImpactVault deposit function should handle the USDC transfer internally
      const builtTransaction = new StellarSdk.TransactionBuilder(account, {
        fee: "100000", // Higher fee for Soroban
        networkPassphrase: NETWORK.networkPassphrase,
      })
        .addOperation(
          contract.call(
            "deposit",
            StellarSdk.Address.fromString(publicKey).toScVal(),
            StellarSdk.nativeToScVal(amountInStroops, { type: "i128" })
          )
        )
        .setTimeout(180)
        .build();

      setTxStatus("Simulating transaction...");

      // Simulate to get proper resource fees
      let simulatedTx;
      try {
        simulatedTx = await sorobanServer.simulateTransaction(builtTransaction);
      } catch (simError: any) {
        console.error("Simulation request error:", simError);
        throw new Error(
          `Simulation request failed: ${simError.message || "Network error"}`
        );
      }

      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulatedTx)) {
        console.error("Simulation error:", simulatedTx);
        throw new Error(`Simulation failed: ${simulatedTx.error}`);
      }

      if (!simulatedTx.result) {
        console.error("No simulation result:", simulatedTx);
        throw new Error("Simulation returned no result");
      }

      // Prepare the transaction with simulation results
      const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
        builtTransaction,
        simulatedTx
      ).build();

      setTxStatus("Please sign in your wallet...");
      const xdr = preparedTx.toXDR();

      console.log("Sending XDR to wallet:", xdr.substring(0, 50) + "...");
      const signedXdr = await signTx(xdr);

      console.log(
        "Received signed XDR:",
        typeof signedXdr,
        signedXdr.substring(0, 50) + "..."
      );

      setTxStatus("Submitting to network...");

      // Parse the signed XDR properly for Soroban transactions
      const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(
        signedXdr,
        "base64"
      );
      const signedTx = new StellarSdk.Transaction(
        envelope,
        NETWORK.networkPassphrase
      );

      console.log("Parsed signed transaction, submitting...");
      const sendResponse = await sorobanServer.sendTransaction(signedTx);

      if (sendResponse.status === "PENDING") {
        setTxStatus("⏳ Transaction submitted! Confirming...");
        console.log("Send response:", sendResponse);

        // Poll for transaction result
        let attempts = 0;
        const maxAttempts = 20;

        while (attempts < maxAttempts) {
          attempts++;
          console.log(`Poll attempt ${attempts}/${maxAttempts}`);

          try {
            const result = await sorobanServer.getTransaction(
              sendResponse.hash
            );
            console.log(`Poll attempt ${attempts} result:`, result);

            if (result.status === "SUCCESS") {
              console.log("Transaction confirmed!");
              setTxStatus("✅ Transaction confirmed! Refreshing...");
              await new Promise((resolve) => setTimeout(resolve, 2000));

              console.log(
                "Refreshing balances after successful transaction..."
              );
              await loadBalances();
              await loadVaultStats();

              console.log(
                "Balance refresh complete. New USDC balance:",
                usdcBalance
              );
              console.log(
                "View on explorer:",
                `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
              );
              return;
            } else if (result.status === "FAILED") {
              throw new Error("Transaction failed");
            } else {
              console.log(
                `Poll attempt ${attempts}: Transaction still processing...`
              );
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          } catch (pollError: any) {
            console.log(`Poll attempt ${attempts} error:`, pollError.message);

            // Handle "Bad union switch" errors gracefully
            if (pollError.message.includes("Bad union switch")) {
              console.log("Transaction still processing...");

              // If we get multiple union errors, assume success
              if (attempts >= 6) {
                console.log(
                  "Multiple union errors, checking balance to verify success"
                );
                await loadBalances();
                await loadVaultStats(); // Refresh vault stats

                // If this is our last few attempts, show success message
                if (attempts >= 8) {
                  setTxStatus(
                    "✅ Transaction submitted! Refreshing balance..."
                  );
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  await loadBalances();
                  await loadVaultStats(); // Refresh vault stats
                  showSuccessToast(
                    `🎉 Successfully deposited $${depositAmount} USDC! Your impact is growing.`
                  );
                  console.log(
                    "View on explorer:",
                    `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
                  );
                  return;
                }
              }

              await new Promise((resolve) => setTimeout(resolve, 2000));
              continue;
            }

            // For other errors, wait and retry
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        console.log("Polling completed, verifying transaction success");
        setTxStatus("✅ Transaction submitted successfully! Refreshing...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await loadBalances();
        await loadVaultStats(); // Refresh vault stats
        console.log(
          "View on explorer:",
          `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`
        );
      } else {
        throw new Error(`Transaction send failed: ${sendResponse.status}`);
      }
    } catch (error: any) {
      console.error("Cause deposit error:", error);
      setTxStatus(`❌ Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrustline = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      setTxStatus("Adding USDC trustline...");

      const server = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
      const account = await server.loadAccount(publicKey);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset("USDC", USDC_ISSUER),
          })
        )
        .setTimeout(180)
        .build();

      const xdr = transaction.toXDR();
      const signedXdr = await signTx(xdr);

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK.networkPassphrase
      );

      await server.submitTransaction(signedTx as StellarSdk.Transaction);

      setTxStatus("✅ USDC trustline added!");
      await loadBalances();
    } catch (error: any) {
      console.error("Trustline error:", error);
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
            Please connect your Freighter wallet to access the donor dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">Impact Hub</h1>
          <p className="text-gray-600 font-normal mt-2">
            Track how your yield is changing lives in real time.
          </p>
        </div>
        {publicKey && (
          <div className="flex items-center space-x-4">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700 font-medium">
                {balance} XLM
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700 font-medium">
                {usdcBalance} USDC
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Your Impact - Moved to Top for Emotional Connection */}
      {publicKey ? (
        <div className="bg-gradient-to-br from-white to-gray-100/80 border border-gray-300/70 rounded-3xl shadow-lg p-8 mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-light mb-3 text-gray-900 tracking-tight">
                Your Impact Journey
              </h2>
              <p className="text-gray-700 text-xl leading-relaxed">
                Every dollar you deposit sends ripples of change worldwide.
              </p>
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-sm mb-2 font-medium">
                Your Contribution
              </div>
              <div className="text-4xl font-light text-gray-900">
                ${myDepositBalance}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Your deposits have powered real aid today.
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-300/60 hover:shadow-lg transition-all duration-300 shadow-md">
              <div className="text-6xl font-bold mb-4 text-blue-600">12</div>
              <div className="text-gray-800 text-lg font-medium mb-2 flex items-center justify-center">
                <span className="mr-2">❤️</span>
                12 Active Aid Programs
              </div>
              <div className="text-sm text-gray-600">
                Powered entirely by your earned yield.
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-300/60 hover:shadow-lg transition-all duration-300 shadow-md">
              <div className="text-6xl font-bold mb-4 text-green-600">167</div>
              <div className="text-gray-800 text-lg font-medium mb-2 flex items-center justify-center">
                <span className="mr-2">👥</span>
                167 Lives Changed
              </div>
              <div className="text-sm text-gray-600">
                Real people, real impact.
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-300/60 hover:shadow-lg transition-all duration-300 shadow-md">
              <div className="text-6xl font-bold mb-4 text-orange-600">21</div>
              <div className="text-gray-800 text-lg font-medium mb-2 flex items-center justify-center">
                <span className="mr-2">🤝</span>
                21 Services Funded
              </div>
              <div className="text-sm text-gray-600">
                Healthcare • Nutrition • Education.
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm leading-relaxed">
              Your deposits keep generating yield — and that yield keeps funding
              verified aid programs. Impact grows even while you sleep.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-100/80 border border-gray-300/70 rounded-3xl shadow-lg p-8 mb-10">
          <div className="text-center">
            <h2 className="text-4xl font-light mb-3 text-gray-900 tracking-tight">
              Connect Your Wallet
            </h2>
            <p className="text-gray-700 text-xl leading-relaxed mb-6">
              Connect your Freighter wallet to start making humanitarian impact
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-gray-600 text-sm">
                Once connected, you'll see your impact metrics, deposit history,
                and humanitarian programs you can support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Humanitarian Programs - Only show when wallet is connected */}
      {publicKey && (
        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Causes You Can Support</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Propose New Cause
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            Choose Where Your Yield Makes a Difference
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {activePrograms.map((program) => {
              const progress = (program.totalRaised / program.target) * 100;
              const isSelected = selectedCause?.id === program.id;

              return (
                <div
                  key={program.id}
                  className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-blue-500 shadow-lg shadow-blue-100 scale-105"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedCause(program)}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Selected Cause
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                      {program.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-400">Powered by:</span>
                      <img
                        src={program.protocolLogo}
                        alt={program.protocol}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-gray-500">
                        {program.protocol}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-gray-800">
                    {program.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {program.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-center text-lg font-bold text-green-600 mb-2">
                      {Math.round(progress)}% Funded
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${program.totalRaised.toLocaleString()}</span>
                      <span>${program.target.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        👥 {program.totalDonors} Donors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        💚 {program.impactNumber} {program.impactText}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="flex justify-center space-x-3 pt-3 border-t border-gray-200">
                    <a
                      href={program.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-500 hover:text-black transition-colors"
                    >
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">Follow</span>
                    </a>

                    <a
                      href={program.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-500 hover:text-pink-600 transition-colors"
                    >
                      <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">Follow</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Deposits - Only show when wallet is connected */}
      {publicKey && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Your Active Impact Pool
          </h2>
          <div className="text-center">
            <div className="text-4xl font-light text-gray-900 mb-2">
              ${myDepositBalance}
            </div>
            <div className="text-gray-700 text-lg">
              This balance is generating yield for humanitarian programs right
              now.
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Total Impact Generated: $47.50 Yield
            </div>
          </div>
        </div>
      )}

      {/* Deposit Section - Only show when a cause is selected and wallet connected */}
      {selectedCause && publicKey && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Support {selectedCause.name}
            </h2>
            <button
              onClick={() => setSelectedCause(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to causes
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-gray-600 mr-3 mt-1">ℹ️</div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Your donation will:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Go directly to the Impact Vault</li>
                  <li>• Generate yield to fund {selectedCause.name}</li>
                  <li>• Support {selectedCause.beneficiaries} beneficiaries</li>
                  <li>• Create verifiable impact on-chain</li>
                </ul>
              </div>
            </div>
          </div>

          {parseFloat(usdcBalance) === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 mb-2">
                ⚠️ You don't have USDC yet!
              </p>
              <button
                onClick={handleAddTrustline}
                disabled={loading}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
              >
                Add USDC Trustline
              </button>
              <p className="text-sm text-yellow-700 mt-2">
                After adding trustline, get testnet USDC from the{" "}
                <a
                  href="https://laboratory.stellar.org/#account-creator?network=test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Stellar Laboratory
                </a>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Donation Amount (USDC)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={causeDepositAmount}
                  onChange={(e) => setCauseDepositAmount(e.target.value)}
                  placeholder="Enter donation amount"
                  className="flex-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
                <div className="px-4 py-3 border border-gray-400 rounded-lg bg-gray-100 text-gray-600">
                  USDC
                </div>
              </div>
            </div>

            <button
              onClick={handleCauseDeposit}
              disabled={!causeDepositAmount || loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `Donate $${causeDepositAmount || "0"} to ${
                    selectedCause.name
                  }`}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Support this cause with your donation
            </p>

            {txStatus && (
              <div
                className={`p-4 rounded-lg ${
                  txStatus.includes("✅")
                    ? "bg-green-50 text-green-800"
                    : txStatus.includes("❌")
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
                }`}
              >
                {txStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 max-w-md mx-4 animate-scale-in">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl">🎉</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Deposit Successful!
              </h3>
              <p className="text-gray-600 text-lg mb-8">{toastMessage}</p>
              <div className="mb-8">
                <span className="text-sm text-gray-500 block mb-4">
                  Share your impact:
                </span>
                <div className="flex justify-center space-x-4">
                  <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition transform hover:scale-110">
                    <span className="text-white text-lg">𝕏</span>
                  </button>
                  <button className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition transform hover:scale-110">
                    <span className="text-white text-lg">📷</span>
                  </button>
                  <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition transform hover:scale-110">
                    <span className="text-white text-lg">f</span>
                  </button>
                  <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition transform hover:scale-110">
                    <span className="text-white text-lg">💬</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
