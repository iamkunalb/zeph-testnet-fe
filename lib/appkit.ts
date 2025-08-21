import { createAppKit, defaultConfig } from "@reown/appkit-ethers-react-native";
import "@walletconnect/react-native-compat";

let initialized = false;

export function initAppKit() {
  if (initialized) return;


    // 1. Get projectId from https://dashboard.reown.com
    const projectId = "0d70fc8cf98c1a5ffdd6ac8da4ebc686";

    // 2. Create config
    const metadata = {
    name: "AppKit RN",
    description: "AppKit RN Example",
    url: "https://reown.com/appkit",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
    redirect: {
        native: "myapp://",
    },
    };


  const config = defaultConfig({ metadata });

  const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  };

  const polygon = {
    chainId: 137,
    name: "Polygon",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
  };



  createAppKit({
    projectId,
    metadata,
    config,
    chains: [mainnet, polygon],
    enableAnalytics: true,
  });

  initialized = true;
}