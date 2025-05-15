import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Chain, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';
import { getTokenSymbol } from '../utils/blockchainUtils'

const mainChain = {
  id: process.env.NEXT_PUBLIC_CHAIN_ID as any as number,
  name: process.env.NEXT_PUBLIC_CHAIN_NAME,
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_CHAIN_NAME,
    symbol: getTokenSymbol(),
    decimals: process.env.NEXT_PUBLIC_DECIMALS as any as number,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL],
    }
  }
} as Chain;

const config = getDefaultConfig({
  appName: "Pump Fun",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainChain],
  ssr: true,
});


const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WebSocketProvider>
            <Component {...pageProps} />
          </WebSocketProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
      <ToastContainer />
    </WagmiConfig>
  )
}