"use client";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStorage, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Chain,
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WebSocketProvider } from "@/components/providers/WebSocketProvider";
import { getTokenSymbol } from "../utils/blockchainUtils";
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import dynamic from "next/dynamic";
import { useIsTelegram } from "../components/telegram/TelegramProvider";
import { useEffect, useState } from "react";
const TelegramProvider = dynamic(
  () => import("@/components/telegram/TelegramProvider"),
  {
    ssr: false,
  }
);

const mainChain = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME,
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_CHAIN_NAME,
    symbol: getTokenSymbol(),
    decimals: Number(process.env.NEXT_PUBLIC_DECIMALS),
  },
  iconUrl: process.env.NEXT_PUBLIC_ICON_URL,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL],
    },
  },
} as Chain;

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isTelegram = useIsTelegram();

  const wallets = [walletConnectWallet];
  // if (!isTelegram) {
    wallets.push(metaMaskWallet);
    wallets.push(trustWallet);
    wallets.push(rainbowWallet);
  // }

  const storage =
    typeof window !== "undefined"
      ? createStorage({ storage: window.localStorage })
      : undefined;

  const config = getDefaultConfig({
    appName: "HyperLiquid Fun",
    projectId: "4ac68c970d9609abb26a471fb3472c63",
    chains: [mainChain],
    syncConnectedChain: true,
    wallets: [
      {
        groupName: "Recommended",
        wallets: wallets,
      },
    ],
    storage,
  });

  if (!mounted) return null;

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <WebSocketProvider>
            {isTelegram ? <TelegramProvider /> : null}
            <Component {...pageProps} />
          </WebSocketProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
      <ToastContainer />
    </WagmiProvider>
  );
}
