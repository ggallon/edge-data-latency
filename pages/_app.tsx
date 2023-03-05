import "@tremor/react/dist/esm/tremor.css"
import type { AppProps } from "next/app"
import { Provider } from "react-wrap-balancer"
import "@/styles/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}
