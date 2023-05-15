import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Banner } from "@/component/Banner";
import { NavBar } from "@/component/NavBar";
import { SectionCard } from "@/component/SectionCard";
import {
  searchPopularVideos,
  searchYoutubeList,
} from "@/lib/SearchYoutubeData";
import {
  youtube_v3, // For every service client, there is an exported namespace
} from "googleapis";
import Head from "next/head";
import { useEffect } from "react";
import { loginAfterLink } from "@/lib/loginWithFirebase";

export async function getServerSideProps() {
  console.log("getServerSideProps");
  const disneyVideos = await searchYoutubeList("Disney");
  const productivityVideos = await searchYoutubeList("Productivity");
  const travelVideos = await searchYoutubeList("Travel");

  const popularVideos = await searchPopularVideos();

  return {
    props: {
      disneyVideos: disneyVideos?.items ?? [],
      productivityVideos: productivityVideos?.items ?? [],
      travelVideos: travelVideos?.items ?? [],
      popularVideos: popularVideos?.items ?? [],
    },
  };
}

type Props = {
  disneyVideos: youtube_v3.Schema$SearchResult[];
  productivityVideos: youtube_v3.Schema$SearchResult[];
  travelVideos: youtube_v3.Schema$SearchResult[];
  popularVideos: youtube_v3.Schema$Video[];
};

export default function Home(props: Props) {
  const { disneyVideos, productivityVideos, travelVideos, popularVideos } =
    props;

  return (
    <>
      <Head>
        <title>Netflix Clone</title>
        <meta name="description" content="This site is a clone of Netflix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <NavBar userName="Saori" />
        <Banner
          title="Yukiko The Movie"
          subTitle="Yukiko is a perfect girl!"
          imgUrl="/static/ゆきこ１.png"
        />
        <div className={styles.sectionWrapper}>
          <SectionCard title="Disney" videoInfos={disneyVideos} size="L" />
          <SectionCard
            title="Productivity"
            videoInfos={productivityVideos}
            size="M"
          />
          <SectionCard title="Travel" videoInfos={travelVideos} size="S" />

          <SectionCard title="Popular" videoInfos={popularVideos} size="S" />
        </div>
      </main>
    </>
  );
}
