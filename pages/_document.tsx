import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="flex h-screen w-screen flex-col h-screen-ios">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
