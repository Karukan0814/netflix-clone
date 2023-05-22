import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "material-icons/iconfont/material-icons.css";
import { Roboto_Slab } from "next/font/google";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createMagic } from "@/lib/magic-client";
import { LoginuserContext } from "@/lib/UserContext";
import { Loading } from "@/component/Loading";
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    setLoading(false);

    const magic = createMagic();

    magic?.user.isLoggedIn().then((isLoggedIn) => {
      console.log({ isLoggedIn });
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => {
          console.log("userData", userData);
          setUser(userData.email);
        });
      } else {
        router.push("/login");

        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <LoginuserContext.Provider value={{ user, setUser }}>
      <main className={robotoSlab.className}>
        {loading ? <Loading /> : <Component {...pageProps} />}
      </main>
    </LoginuserContext.Provider>
  );
}
