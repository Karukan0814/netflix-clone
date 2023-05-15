"use client";

import React from "react";
import styles from "./SectionCard.module.css";
import { Card } from "./Card";
import {
  youtube_v3, // For every service client, there is an exported namespace
} from "googleapis";
import { cardSize } from "@/lib/type/cardSizeTypes";

type Props = {
  title: string;
  videoInfos: youtube_v3.Schema$SearchResult[] | youtube_v3.Schema$Video[];
  size: cardSize;
};

export const SectionCard = (props: Props) => {
  const { title, videoInfos = [], size } = props;

  return (
    <section className={styles.cardSectionContainer}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.cardsWrapper}>
        {videoInfos.map((el, index) => {
          let imgUrl = el.snippet?.thumbnails?.high?.url;
          if (!imgUrl) {
            imgUrl = "/static/ゆきこ２.png";
          }

          return <Card key={index} size={size} imgUrl={imgUrl} />;
        })}
      </div>
    </section>
  );
};
