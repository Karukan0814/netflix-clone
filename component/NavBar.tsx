"use client";

import React, { forwardRef, useContext, useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import Link from "next/link";
import Image from "next/image";
import { createMagic } from "@/lib/magic-client";
import { useRouter } from "next/router";
import { LoginuserContext } from "@/lib/userContext";

export const NavBar = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const { user, setUser } = useContext(LoginuserContext);
  const router = useRouter();

  const magic = createMagic();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await magic?.user.logout(); //magicLinkからログアウト

      //cookieからtokenを削除

      const res = await fetch("/api/logout", {
        method: "POST",
      });
    } catch {
      // Handle errors if required!
      console.log("something went wrong with sign out!");
    } finally {
      console.log("finally! jump to login");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBarWrapper}>
        <div className={styles.logoWrapper}>
          <Link className={styles.logoLink} href="/">
            <Image
              src="/static/netflix.svg"
              fill
              alt="Netflix logo"
              className={styles.logoImg}
            />
          </Link>
        </div>
        <ul className={styles.navItems}>
          <Link className={styles.navItem} href="/">
            Home
          </Link>
          <Link className={styles.navItem} href="/browse/myList">
            My List
          </Link>
        </ul>
        <nav className={styles.navContainer}>
          <ul>
            <li className={styles.userNameWrapper}>
              <button className={styles.userNameBtn}>
                {user}
                <span
                  className={`material-icons ${styles.expand_more_icon}`}
                  onClick={() => {
                    setShowDropDown(!showDropDown);
                  }}
                >
                  expand_more
                </span>
              </button>
            </li>
            {showDropDown && (
              <li className={styles.navDropdown}>
                <Link
                  className={styles.signOutLink}
                  href="/login"
                  onClick={(
                    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                  ) => handleSignOut(e)}
                >
                  Sign out
                </Link>
              </li>
            )}
          </ul>
          <div></div>
        </nav>
      </div>
    </div>
  );
};
