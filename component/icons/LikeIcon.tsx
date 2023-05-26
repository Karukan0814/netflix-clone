import React, { useEffect, useState } from "react";
import styles from "./LikeIcon.module.css";
import { Favorited } from "@/lib/type/videoInfo";

type Props = { videoId: string; favourited: Favorited };

export const LikeIcon = (props: Props) => {
  const { videoId, favourited } = props;
  const [likeFlag, setLikeflag] = useState(false);
  const [dislikeFlag, setDisikeflag] = useState(false);

  const handleLikefalg = () => {
    if (likeFlag) {
      //likeを外す場合
      setLikeflag(false);
    } else {
      // likeをつける場合
      //dislikeがついていた場合に備えて外す
      setDisikeflag(false);
      setLikeflag(true);
    }
    updateFavoriteFlag(likeFlag ? null : 1);
  };
  const handleDislikefalg = () => {
    if (dislikeFlag) {
      //dislikeを外す場合
      setDisikeflag(false);
    } else {
      // dislikeをつける場合
      //likeがついていた場合に備えて外す
      setLikeflag(false);
      setDisikeflag(true);
    }

    updateFavoriteFlag(dislikeFlag ? null : 0);
  };

  const updateFavoriteFlag = async (changedVal: Favorited) => {
    const res = await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited: changedVal,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    console.log({ favourited });
    if (favourited === 0) {
      setDisikeflag(true);
    } else if (favourited === 1) {
      setLikeflag(true);
    }
  }, []);
  return (
    <>
      <button className={styles.BtnWrapper} onClick={handleLikefalg}>
        <div className={styles.iconContainer}>
          {likeFlag ? (
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

      <button className={styles.BtnWrapper} onClick={handleDislikefalg}>
        <div className={styles.iconContainer}>
          {dislikeFlag ? (
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
