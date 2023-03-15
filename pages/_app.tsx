import type { AppProps } from "next/app"
import { Provider } from "react-wrap-balancer"
import { Footer } from "@/components/Footer"
import { GlobalNav } from "@/components/GlobalNav"
import "@/styles/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <GlobalNav />
      <Component {...pageProps} />
      <Footer />
    </Provider>
  )
}
