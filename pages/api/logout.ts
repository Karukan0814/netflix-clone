import { removeTokenCookie } from "@/lib/cookie";
import { Magic } from "@magic-sdk/admin";
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
      const cookie = removeTokenCookie(res);

      res.status(200).json({ done: true });
    } catch (error) {
      res.status(500).json({ done: false });
    }
  }
}
