"use client";
import Image from "next/image";
import React from "react";
import styles from "./Banner.module.css";
import { useRouter } from "next/router";

type Props = {
  id: string;

  title: string;
  subTitle: string;
  imgUrl: string;
  //   handleOnClick: () => void;
};
export const Banner = (props: Props) => {
  const { id, title = "ゆきこ", subTitle, imgUrl } = props;
  const router = useRouter();

  const handleOnPlay = () => {
    router.push(`/video/${id}`);
  };
  return (
    <div
      className={styles.bannerContainer}
      style={{
        backgroundImage: `url(${imgUrl}`,
      }}
    >
      <div className={styles.bannerContentsContainer}>
        <div className={styles.bannerTitleWrapper}>
          <h1 className={styles.title}>{title}</h1>
          <h2 className={styles.subTitle}>{subTitle}</h2>
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
