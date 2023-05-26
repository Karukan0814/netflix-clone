import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/video.module.css";
import { searchVideos } from "@/lib/VideoData";
import { GetStaticPropsContext } from "next";
import { youtube_v3 } from "googleapis";
import { NavBar } from "@/component/NavBar";
import { LikeIcon } from "@/component/icons/LikeIcon";
import { Favorited, VideoInfoStats } from "@/lib/type/videoInfo";

Modal.setAppElement("#__next");

export async function getStaticProps(staticProps: GetStaticPropsContext) {
  const { params } = staticProps;
  let videoList;
  if (params && params.videoId) {
    videoList = await searchVideos(false, params.videoId.toString());
  }
  let video = null;
  if (videoList && videoList.items) {
    video = videoList.items[0];
  }
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
  video: youtube_v3.Schema$Video | null;
};

export default function Video(props: Props) {
  const router = useRouter();
  const { video } = props;

  const { videoId } = router.query;
  // const [videoInfo, setVideoInfo] = useState<youtube_v3.Schema$Video | null>(
  //   null
  // );
  const [error, setError] = useState("");
  const [favorited, setFavorited] = useState<Favorited>(null);
  const [watched, setWatched] = useState(false);

  const handleLikeflag = () => {
    let changedVal: Favorited = favorited === 1 ? null : 1;

    setFavorited(changedVal);
    updateFavoriteFlag(changedVal);
  };
  const handleDislikeflag = () => {
    let changedVal: Favorited = favorited === 0 ? null : 0;

    setFavorited(changedVal);
    updateFavoriteFlag(changedVal);
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
    console.log("useEffect videoId");
    const fetchVideoUserInfo = async () => {
      console.log("fetchVideoUserInfo");
      const res = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      res.json().then((val) => {
        if (val.videoInfos && val.videoInfos.length > 0) {
          //既にHasuraにvideoの情報が登録されていたらセット
          setFavorited(val.videoInfos[0].favorited);
          setWatched(val.videoInfos[0].watched);
        }
      });
    };
    fetchVideoUserInfo();
  }, [videoId]);

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
            <LikeIcon
              handleLikeflag={handleLikeflag}
              handleDislikeflag={handleDislikeflag}
              favorited={favorited}
            />
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.modalBodyCol1}>
              <p className={styles.publishTime}>
                {video?.snippet?.publishedAt}
              </p>
              <p className={styles.title}>{video?.snippet?.title}</p>
              <p className={styles.description}>
                {video?.snippet?.description}
              </p>
            </div>
            <div className={styles.modalBodyCol2}>
              <div className={styles.subTextWrapper}>
                <p className={styles.subText}>
                  <span className={styles.subTextTitle}>
                    ViewCount:{video?.statistics?.viewCount}
                  </span>
                  <span className={styles.subTextContent}></span>
                </p>
              </div>
              <p className={styles.subText}>
                <span className={styles.subTextTitle}>
                  Cast:{video?.snippet?.channelTitle}
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
