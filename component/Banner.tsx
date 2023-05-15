"use client";
import Image from "next/image";
import React from "react";
import styles from "./Banner.module.css";

type Props = {
  title: string;
  subTitle: string;
  imgUrl: string;
  //   handleOnClick: () => void;
};
export const Banner = (props: Props) => {
  const { title, subTitle, imgUrl } = props;

  const handleOnPlay = () => {
    console.log("handleOnPlay");
  };
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContentsContainer}>
        <div className={styles.bannerTitleWrapper}>
          <h1>{title}</h1>
          <h2>{subTitle}</h2>
        </div>
        <div className={styles.bannerButtonWrapper}>
          <button className={styles.bannerButton} onClick={handleOnPlay}>
            <span className={`material-icons `}>play_arrow</span>
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
