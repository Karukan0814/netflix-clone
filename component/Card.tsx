"use client";

import Image from "next/image";
import React, { useState } from "react";
import styles from "./Card.module.css";
import { motion } from "framer-motion";
import { cardSize } from "@/lib/type/cardSizeTypes";
type Props = {
  imgUrl: string;
  size: cardSize;
  isScale?: boolean;
};

const defaultImg = "/static/ゆきこ２.png";
export const Card = (props: Props) => {
  const { imgUrl, size, isScale = true } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const sizeMap = {
    L: styles.imgLarge,
    M: styles.imgMedium,
    S: styles.imgSmall,
  };

  const handleOnError = () => {
    console.log("ImageUrl Error!");
    setImgSrc(defaultImg);
  };

  const shouldHover = isScale && {
    whileHover: { scale: 1.2 },
  };
  return (
    <div className={styles.cardContainer}>
      <motion.div
        className={`${sizeMap[size]} ${styles.motionWrapper}`}
        {...shouldHover}
      >
        <Image
          src={imgSrc}
          alt="image"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.cardImg}
          onError={handleOnError}
          loading="lazy"
        />
      </motion.div>
    </div>
  );
};
