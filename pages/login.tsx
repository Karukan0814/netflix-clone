import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { createMagic } from "@/lib/magic-client";
import { Magic, RPCError, RPCErrorCode } from "magic-sdk";
import { LoginuserContext } from "@/lib/UserContext";

type FormValues = {
  email: string;
};

export default function login() {
  const [isLoading, setIsLoading] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  const { user, setUser } = useContext(LoginuserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const magic = createMagic();
    try {
      setIsLoading(true);
      // Trigger Magic link to be sent to user
      let didToken = await magic?.auth.loginWithMagicLink({
        email: data.email,
        // redirectURI: new URL("/", window.location.origin).href, // optional redirect back to your app after magic link is clicked
      });

      if (didToken) {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${didToken}`,
            "Content-Type": "application/json",
          },
        });

        const loginRes = await res.json();
        if (loginRes.done) {
          //Contextにユーザー情報を入れる
          let user = await magic?.user.getMetadata();
          setUser(user?.email ?? null);
          router.push("/");
        } else {
          setIsLoading(false);
          setUserMsg("Something went wrong with login");
        }
      }
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            // Handle errors accordingly :)
            break;
        }
      }
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Clone</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <Link className={styles.logoLink} href="/login">
            <Image
              src="/static/netflix.svg"
              fill
              alt="Netflix logo"
              className={styles.logoImg}
            />
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className={styles.signinHeader}>Sign in</h1>
            {userMsg && <p>{userMsg}</p>}
            <input
              className={styles.emailInput}
              placeholder="email address"
              {...register("email", {
                required: "required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              type="email"
              disabled={isLoading}
            />

            <button
              type="submit"
              className={styles.signInButton}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
