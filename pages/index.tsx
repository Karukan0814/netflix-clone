import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Banner } from "@/component/Banner";
import { NavBar } from "@/component/NavBar";
import { SectionCard } from "@/component/SectionCard";
import {
  getWatchedVideoFromHasura,
  searchVideos,
  searchYoutubeList,
} from "@/lib/VideoData";
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

  const watchedVideos = await getWatchedVideoFromHasura(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweDAzRjlDNDM5MjZCQzNkNTliQWQ4RmNCZjE1ODZmMzZBZTBEOTZBQzUiLCJwdWJsaWNBZGRyZXNzIjoiMHgwM0Y5QzQzOTI2QkMzZDU5YkFkOEZjQmYxNTg2ZjM2QWUwRDk2QUM1IiwiZW1haWwiOiJrb3NhbWVodXJ1YXNhQGdtYWlsLmNvbSIsIm9hdXRoUHJvdmlkZXIiOm51bGwsInBob25lTnVtYmVyIjpudWxsLCJ3YWxsZXRzIjpbXSwiaWF0IjoxNjg0Nzg3ODU3LCJleHAiOjE2ODUzOTI2NTcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLXVzZXItaWQiOiJkaWQ6ZXRocjoweDAzRjlDNDM5MjZCQzNkNTliQWQ4RmNCZjE1ODZmMzZBZTBEOTZBQzUifX0.0vHhmStAnBsvD-QnFXkHDk4u-Xa7WdXnAAai6oyCKCA",
    "did:ethr:0x03F9C43926BC3d59bAd8FcBf1586f36Ae0D96AC5"
  );

  return {
    props: {
      disneyVideos: disneyVideos?.items ?? [],
      productivityVideos: productivityVideos?.items ?? [],
      travelVideos: travelVideos?.items ?? [],
      popularVideos: popularVideos?.items ?? [],
      watchedVideos: watchedVideos.map((video) => {
        return {
          videoId: video.videoId,
          imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
        };
      }),
    },
  };
}

type Props = {
  disneyVideos: youtube_v3.Schema$SearchResult[];
  productivityVideos: youtube_v3.Schema$SearchResult[];
  travelVideos: youtube_v3.Schema$SearchResult[];
  popularVideos: youtube_v3.Schema$Video[];
  watchedVideos: { videoId: string; imgUrl: string };
};

export default function Home(props: Props) {
  const {
    disneyVideos,
    productivityVideos,
    travelVideos,
    popularVideos,
    watchedVideos,
  } = props;

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
          <SectionCard
            title="Watched it again"
            videoInfos={disneyVideos}
            size="L"
          />

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
