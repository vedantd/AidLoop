import { useEffect, useState } from "react";

export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState({
    freighterDetected: false,
    freighterApi: null as any,
    windowKeys: [] as string[],
    userAgent: "",
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Run diagnostics
    const runDiagnostics = () => {
      const windowKeys = Object.keys(window).filter(
        (key) =>
          key.toLowerCase().includes("freighter") ||
          key.toLowerCase().includes("stellar") ||
          key.toLowerCase().includes("wallet")
      );

      setDiagnostics({
        freighterDetected: !!window.freighterApi,
        freighterApi: window.freighterApi
          ? {
              hasIsConnected:
                typeof window.freighterApi.isConnected === "function",
              hasGetPublicKey:
                typeof window.freighterApi.getPublicKey === "function",
              hasSignTransaction:
                typeof window.freighterApi.signTransaction === "function",
            }
          : null,
        windowKeys,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    };

    runDiagnostics();

    // Re-check every 2 seconds in case Freighter loads late
    const interval = setInterval(runDiagnostics, 2000);
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    try {
      if (!window.freighterApi) {
        alert("❌ Freighter API not found in window object");
        return;
      }

      alert("✅ Freighter API detected! Testing connection...");

      const publicKey = await window.freighterApi.getPublicKey();
      alert(`✅ Connected! Public Key: ${publicKey}`);
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Freighter Diagnostic Tool</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Detection Status</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-2xl mr-2">
              {diagnostics.freighterDetected ? "✅" : "❌"}
            </span>
            <span className="font-semibold">
              Freighter API{" "}
              {diagnostics.freighterDetected ? "Detected" : "NOT Detected"}
            </span>
          </div>

          {diagnostics.freighterApi && (
            <div className="ml-8 text-sm space-y-1 text-gray-600">
              <div>
                • isConnected:{" "}
                {diagnostics.freighterApi.hasIsConnected ? "✅" : "❌"}
              </div>
              <div>
                • getPublicKey:{" "}
                {diagnostics.freighterApi.hasGetPublicKey ? "✅" : "❌"}
              </div>
              <div>
                • signTransaction:{" "}
                {diagnostics.freighterApi.hasSignTransaction ? "✅" : "❌"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Window Object Analysis</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Wallet-related keys found in window:{" "}
            <strong>{diagnostics.windowKeys.length}</strong>
          </p>
          {diagnostics.windowKeys.length > 0 ? (
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              {diagnostics.windowKeys.join(", ")}
            </div>
          ) : (
            <p className="text-sm text-red-600">No wallet-related keys found</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Browser Information</h2>
        <div className="text-sm space-y-1">
          <div>
            <strong>User Agent:</strong>
          </div>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
            {diagnostics.userAgent}
          </div>
          <div className="mt-2">
            <strong>Last Updated:</strong>{" "}
            {new Date(diagnostics.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Manual Test</h2>
        <button
          onClick={testConnection}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Test Freighter Connection
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-yellow-900">
          Troubleshooting Steps
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
          <li>
            <strong>Install Freighter:</strong>{" "}
            <a
              href="https://freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://freighter.app/
            </a>
          </li>
          <li>
            <strong>Enable Extension:</strong> Check your browser's extension
            settings
          </li>
          <li>
            <strong>Refresh Page:</strong> Press F5 or Cmd+R after installing
          </li>
          <li>
            <strong>Unlock Freighter:</strong> Enter your password if prompted
          </li>
          <li>
            <strong>Check Console:</strong> Open browser DevTools (F12) →
            Console tab
          </li>
          <li>
            <strong>Try Different Browser:</strong> Chrome/Brave recommended
          </li>
        </ol>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-2 text-blue-900">Manual Check</h3>
        <p className="text-sm text-blue-800 mb-2">
          Open your browser console (F12) and type:
        </p>
        <code className="bg-blue-100 text-blue-900 p-2 rounded block text-xs">
          window.freighterApi
        </code>
        <p className="text-sm text-blue-800 mt-2">
          If it shows <code className="bg-blue-100 px-1">undefined</code>,
          Freighter is not installed or not enabled.
        </p>
      </div>
    </div>
  );
}
