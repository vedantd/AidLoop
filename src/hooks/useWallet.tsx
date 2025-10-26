import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTx: (xdr: string) => Promise<string>;
  kit: StellarWalletsKit | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Initialize the kit once
let walletKit: StellarWalletsKit | null = null;

const getKit = (): StellarWalletsKit => {
  if (!walletKit) {
    walletKit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: "", // Will be set when user selects wallet
      modules: allowAllModules(),
    });
  }
  return walletKit;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnectedState, setIsConnectedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kit] = useState<StellarWalletsKit>(getKit());

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedWalletId = localStorage.getItem("walletId");

    if (savedAddress && savedWalletId) {
      setPublicKey(savedAddress);
      setIsConnectedState(true);
      kit.setWallet(savedWalletId);
    }
  }, [kit]);

  const connect = async () => {
    try {
      setIsLoading(true);

      // Open wallet selection modal
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            // Set the selected wallet
            kit.setWallet(option.id);

            // Get the public key
            const { address } = await kit.getAddress();

            // Save to state and localStorage
            setPublicKey(address);
            setIsConnectedState(true);
            localStorage.setItem("walletAddress", address);
            localStorage.setItem("walletId", option.id);

            console.log(`✅ Connected to ${option.name}: ${address}`);
          } catch (error) {
            console.error("Error getting address:", error);
            throw error;
          }
        },
        onClosed: (err?: Error) => {
          if (err) {
            console.error("Modal closed with error:", err);
          }
        },
        modalTitle: "Connect Your Stellar Wallet",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setIsConnectedState(false);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletId");
  };

  const signTx = async (xdr: string): Promise<string> => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        address: publicKey,
        networkPassphrase: WalletNetwork.TESTNET,
      });

      return signedTxXdr;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: isConnectedState,
        isLoading,
        connect,
        disconnect,
        signTx,
        kit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
