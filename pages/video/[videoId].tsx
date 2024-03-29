import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/video.module.css";
import { GetStaticPropsContext } from "next";
import { NavBar } from "@/component/NavBar";
import { LikeIcon } from "@/component/icons/LikeIcon";
import { Favorited, VideoDataForSection } from "@/lib/type/videoInfo";
import { searchYoutubeVideos } from "@/lib/VideoData";
import YouTube, { YouTubeProps } from "react-youtube";

Modal.setAppElement("#__next");

export async function getStaticProps(staticProps: GetStaticPropsContext) {
  const { params } = staticProps;
  let videoList: VideoDataForSection[] = [];
  if (params && params.videoId) {
    videoList = await searchYoutubeVideos(false, params.videoId.toString());
  }

  return {
    props: {
      video: videoList && videoList.length > 0 ? videoList[0] : null,
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
  video: VideoDataForSection | null;
};

export default function Video(props: Props) {
  const router = useRouter();
  let { video } = props;
  const { videoId } = router.query;

  const [error, setError] = useState("");
  const [favorited, setFavorited] = useState<Favorited>(null);
  const [watched, setWatched] = useState(false);

  const onHandlePlay: YouTubeProps["onPlay"] = async (event) => {
    const res = await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        watched: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const opts: YouTubeProps["opts"] = {
    height: "360",
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
    onplay: { onHandlePlay },
  };

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
    const fetchVideoUserInfo = async () => {
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
          <YouTube
            videoId={videoId?.toString()}
            opts={opts}
            onPlay={onHandlePlay}
            style={{ width: "90%" }}
          />
          <div className={styles.likeDislikeWrapper}>
            <LikeIcon
              handleLikeflag={handleLikeflag}
              handleDislikeflag={handleDislikeflag}
              favorited={favorited}
            />
          </div>
        </div>

        <div className={styles.modalBody}>
          {video && (
            <div className={styles.modalBodyContent}>
              <div className={styles.modalBodyCol1}>
                <p className={styles.publishTime}>{video.publishTime}</p>
                <p className={styles.title}>{video.title}</p>
                <p className={styles.description}>{video.description}</p>
              </div>
              <div className={styles.modalBodyCol2}>
                <div className={styles.subTextWrapper}>
                  <p className={styles.subText}>
                    <span className={styles.subTextTitle}>
                      ViewCount:{video.statistics}
                    </span>
                    <span className={styles.subTextContent}></span>
                  </p>
                </div>
                <p className={styles.subText}>
                  <span className={styles.subTextTitle}>
                    Cast:{video.channelTitle}
                  </span>
                  <span className={styles.subTextContent}></span>
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
