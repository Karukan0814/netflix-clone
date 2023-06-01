"use client";

import React from "react";
import styles from "./SectionCard.module.css";
import { Card } from "./Card";
import { cardSize } from "@/lib/type/cardSizeTypes";
import Link from "next/link";
import { VideoDataForSection } from "@/lib/type/videoInfo";

type Props = {
  title: string;
  videoInfos: VideoDataForSection[];
  size: cardSize;
  isWrap?: boolean;
  isScale?: boolean;
};

export const SectionCard = (props: Props) => {
  const {
    title,
    videoInfos = [],
    size,
    isWrap = false,
    isScale = true,
  } = props;

  return (
    <section className={styles.cardSectionContainer}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={`${styles.cardsWrapper} ${isWrap && styles.wrap}`}>
        {videoInfos.map((el, index) => {
          let imgUrl = el.imgUrl;
          if (!imgUrl) {
            imgUrl = "/static/ゆきこ２.png";
          }

          return (
            <Link href={`/video/${el.videoId}`} key={el.videoId}>
              <Card
                key={el.videoId}
                size={size}
                imgUrl={imgUrl}
                isScale={isScale}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};
