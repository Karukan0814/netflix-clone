import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Banner } from "@/component/Banner";
import { NavBar } from "@/component/NavBar";
import { SectionCard } from "@/component/SectionCard";
import { searchVideos, searchYoutubeList } from "@/lib/SearchYoutubeData";
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

  const popularVideos = await searchVideos(true);

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

  const bannerTitle = "平家物語";
  const bannerId = "ZW40VnNrowY";
  const bannerImg = "https://i.ytimg.com/vi/ZW40VnNrowY/sddefault.jpg";

  return (
    <>
      <Head>
        <title>Netflix Clone</title>
        <meta name="description" content="This site is a clone of Netflix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <NavBar />
        <Banner
          id={bannerId}
          title={bannerTitle}
          subTitle="Hot now!"
          imgUrl={bannerImg}
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
