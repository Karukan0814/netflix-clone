import { removeTokenCookie, setTokenCookie } from "@/lib/cookie";
import { createNewUser, isNewUser } from "@/lib/db/hasura";
import { magicAdmin } from "@/lib/magic";
import { Magic } from "@magic-sdk/admin";
import { MagicUserMetadata } from "magic-sdk";
import { NextApiRequest, NextApiResponse } from "next";
var jwt = require("jsonwebtoken");

// Initiating Magic instance for server-side methods
const magic = new Magic(process.env.MAGIC_SECRET_KEY);
type Data = {
  done: boolean;
};

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      console.log("api logout");
      const cookie = removeTokenCookie(res);

      res.status(200).json({ done: true });
    } catch (error) {
      res.status(500).json({ done: false });
    }
  }
}
