import { findVideobyUser, insertStats, updateStats } from "@/lib/db/hasura";
import { VideoInfoStats } from "@/lib/type/videoInfo";
import { Magic } from "@magic-sdk/admin";
import { NextApiRequest, NextApiResponse } from "next";
var jwt = require("jsonwebtoken");

// Initiating Magic instance for server-side methods
const magic = new Magic(process.env.MAGIC_SECRET_KEY);
type Data = {
  msg?: string;
  videoInfos?: VideoInfoStats[];
};

export default async function stats(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (!req.cookies.token) {
      //tokenなかった場合エラー
      return res.status(403).json({ msg: "token couldn't be found" });
    } else {
      //tokenあった場合
      const token = req.cookies.token;

      //引数受け取り
      const inputParam = req.method === "POST" ? req.body : req.query; //postならbodyから、getならクエリ

      const { videoId } = inputParam;

      if (videoId) {
        //videoIdが取得出来た場合
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //tokenをでコード

        //videoIdからstatsのvideo情報を検索
        const videoInfos = await findVideobyUser(
          token,
          decoded.issuer,
          videoId
        );
        const doesStatsExist = videoInfos && videoInfos.length > 0;
        if (req.method === "POST") {
          //POSTの場合、UPDATE or Insert処理

          let { favourited, watched } = req.body;
          if (favourited === undefined) {
            //動画再生時
            favourited = doesStatsExist ? videoInfos[0].favorited : null;
          } else {
            //likeFlagの操作の場合
            watched = doesStatsExist ? videoInfos[0].watched : false;
          }
          if (doesStatsExist) {
            //update
            const videoInfosChanged = await updateStats(
              token,
              decoded.issuer,
              favourited,
              watched,
              videoId!
            );
            res.status(200).json({ videoInfos: videoInfosChanged });
          } else {
            //add
            const videoInfo = await insertStats(
              token,
              decoded.issuer,
              favourited,
              watched,
              videoId!
            );
            const videoInfosChanged: VideoInfoStats[] = [];
            videoInfosChanged.push(videoInfo);

            res.status(200).json({ videoInfos: videoInfosChanged });
          }
        } else {
          //GETの場合
          res.status(200).json({ videoInfos: videoInfos });
        }
      } else {
        res.status(400).json({ msg: "Please send videoId" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Something went wrong with connecting with Server" });
  }
}
