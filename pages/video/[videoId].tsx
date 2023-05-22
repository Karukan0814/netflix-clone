import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/video.module.css";
import { searchVideos } from "@/lib/SearchYoutubeData";
import { GetStaticPropsContext } from "next";
import { youtube_v3 } from "googleapis";
import { NavBar } from "@/component/NavBar";
import { LikeIcon } from "@/component/icons/LikeIcon";

Modal.setAppElement("#__next");

export async function getStaticProps(staticProps: GetStaticPropsContext) {
  const { params } = staticProps;
  console.log({ params });
  let video = null;
  if (params && params.videoId) {
    video = await searchVideos(false, params.videoId.toString());
  }
  console.log({ video });

  return {
    props: {
      video: video,
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

type Props = {
  video: youtube_v3.Schema$VideoListResponse | null;
};

export default function Video(props: Props) {
  const router = useRouter();
  const { videoId } = router.query;
  const [videoInfo, setVideoInfo] = useState<youtube_v3.Schema$Video | null>(
    null
  );
  const [error, setError] = useState("");

  const { video } = props;

  useEffect(() => {
    if (video && video.items) {
      console.log({ video });
      setVideoInfo(video.items[0]);
    } else {
      setError("data fetchinf error");
    }
  }, []);
  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Example Modal"
        onRequestClose={() => {
          router.back();
        }}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.videoContainer}>
          <iframe
            id="ytplayer"
            className={styles.videoPlayer}
            width="90%"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&origin=http://example.com&rel=0`}
            frameBorder="0"
          ></iframe>
          <div className={styles.likeDislikeWrapper}>
            <LikeIcon />
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.modalBodyCol1}>
              <p className={styles.publishTime}>
                {videoInfo?.snippet?.publishedAt}
              </p>
              <p className={styles.title}>{videoInfo?.snippet?.title}</p>
              <p className={styles.description}>
                {videoInfo?.snippet?.description}
              </p>
            </div>
            <div className={styles.modalBodyCol2}>
              <div className={styles.subTextWrapper}>
                <p className={styles.subText}>
                  <span className={styles.subTextTitle}>
                    ViewCount:{videoInfo?.statistics?.viewCount}
                  </span>
                  <span className={styles.subTextContent}></span>
                </p>
              </div>
              <p className={styles.subText}>
                <span className={styles.subTextTitle}>
                  Cast:{videoInfo?.snippet?.channelTitle}
                </span>
                <span className={styles.subTextContent}></span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
