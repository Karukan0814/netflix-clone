import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "material-icons/iconfont/material-icons.css";
import { Roboto_Slab } from "next/font/google";
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={robotoSlab.className}>
      <Component {...pageProps} />;
    </main>
  );
}
