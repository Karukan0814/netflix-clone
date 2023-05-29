import React, { useEffect, useState } from "react";
import styles from "./LikeIcon.module.css";
import { Favorited } from "@/lib/type/videoInfo";

type Props = {
  handleLikeflag: () => void;
  handleDislikeflag: () => void;
  favorited: Favorited;
};

export const LikeIcon = (props: Props) => {
  const { favorited, handleLikeflag, handleDislikeflag } = props;

  return (
    <>
      <button className={styles.BtnWrapper} onClick={handleLikeflag}>
        <div className={styles.iconContainer}>
          {favorited === 1 ? (
            <span className={`material-icons ${styles.iconContent}`}>
              thumb_up
            </span>
          ) : (
            <span className={`material-icons-outlined ${styles.iconContent}`}>
              thumb_up
            </span>
          )}
        </div>
      </button>

      <button className={styles.BtnWrapper} onClick={handleDislikeflag}>
        <div className={styles.iconContainer}>
          {favorited === 0 ? (
            <span className={`material-icons ${styles.iconContent}`}>
              thumb_down
            </span>
          ) : (
            <span className={`material-icons-outlined ${styles.iconContent}`}>
              thumb_down
            </span>
          )}
        </div>
      </button>
    </>
  );
};
