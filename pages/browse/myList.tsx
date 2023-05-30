import { NavBar } from "@/component/NavBar";
import { VideoDataForSection, VideoInfoStats } from "@/lib/type/videoInfo";
import { redirectUser } from "@/lib/utils";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import styles from "../../styles/mylist.module.css";
import { SectionCard } from "@/component/SectionCard";
import { getMyListFromHasura } from "@/lib/VideoData";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token;
  let userId = await redirectUser(token);
  const myList = await getMyListFromHasura(token!, userId);
  return {
    props: { myList },
  };
}

type Props = {
  myList: VideoDataForSection[];
};

export default function Home(props: Props) {
  const { myList } = props;
  return (
    <>
      <Head>
        <title>Netflix Clone My List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCard
            title="My List"
            videoInfos={myList}
            size="S"
            isWrap={true}
            isScale={false}
          />
        </div>
      </main>
    </>
  );
}
