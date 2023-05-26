"use client";

import React, { forwardRef, useContext, useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import Link from "next/link";
import Image from "next/image";
import { LoginuserContext } from "@/lib/UserContext";
import { createMagic } from "@/lib/magic-client";
import { useRouter } from "next/router";

export const NavBar = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const { user, setUser } = useContext(LoginuserContext);
  const router = useRouter();

  const magic = createMagic();
  // const [user, setUser] = useState("");

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleSignOut = async (
    // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      console.log(await magic?.user.isLoggedIn()); // => `false`
      await magic?.user.logout();
    } catch {
      // Handle errors if required!
      console.log("something went wrong with sign out!");
    } finally {
      console.log("finally! jump to login");
      router.push("/login");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await magic?.user.getMetadata();
        const email = user?.email;
        email && setUser(email);
      } catch {
        console.log("Failed Retrieving userdata");
      }
    };
    getUser();
  }, []);
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
          <Link className={styles.navItem} href="/myList">
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
