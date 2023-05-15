"use client";

import React, { useState } from "react";
import styles from "./NavBar.module.css";
import Link from "next/link";
import Image from "next/image";

type Props = {
  userName: string;
};
export const NavBar = ({ userName }: Props) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown);
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
          <Link className={styles.navItem} href="/myList">
            My List
          </Link>
        </ul>
        <nav className={styles.navContainer}>
          <ul>
            <li className={styles.userNameWrapper}>
              <button className={styles.userNameBtn}>
                {userName}
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
                <Link className={styles.signOutLink} href="/login">
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
