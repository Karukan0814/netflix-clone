import React, { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { loginAfterLink, sendMailLink } from "@/lib/loginWithFirebase";

type FormValues = {
  email: string;
};

export default function login() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("handleLoginBtn");
    reset();
    sendMailLink(data.email);
  };

  useEffect(() => {
    const login = async () => {
      const loginResult = await loginAfterLink();
      if (loginResult) {
        router.push("/"); //Homeに遷移
      }
    };

    console.log("start-login");
    login();
  }, []);

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
            />

            <button type="submit" className={styles.signInButton}>
              Sign in
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
