import styles from "../styles/Home.module.css";
import { Banner } from "@/component/Banner";
import { NavBar } from "@/component/NavBar";
import { SectionCard } from "@/component/SectionCard";

import Head from "next/head";
import { VideoDataForSection } from "@/lib/type/videoInfo";
import { GetServerSidePropsContext } from "next";
import { redirectUser } from "@/lib/utils";
import {
  getWatchedVideoFromHasura,
  searchYoutubeList,
  searchYoutubeVideos,
} from "@/lib/VideoData";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const disneyVideos = await searchYoutubeList("Disney Official");
  const productivityVideos = await searchYoutubeList("Productivity");
  const travelVideos = await searchYoutubeList("Travel");
  const popularVideos = await searchYoutubeVideos(true);

  const token = context.req.cookies.token;

  let userId = await redirectUser(token);

  const watchedVideos = await getWatchedVideoFromHasura(token!, userId); //token was already checked by redirectUser

  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchedVideos,
    },
  };
}

type Props = {
  disneyVideos: VideoDataForSection[];
  productivityVideos: VideoDataForSection[];
  travelVideos: VideoDataForSection[];
  popularVideos: VideoDataForSection[];
  watchedVideos: VideoDataForSection[];
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
        <link rel="icon" href="/favicon.ico" />
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
            videoInfos={watchedVideos}
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
