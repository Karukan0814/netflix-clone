import { setTokenCookie } from "@/lib/cookie";
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

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cookie = setTokenCookie(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweDAzRjlDNDM5MjZCQzNkNTliQWQ4RmNCZjE1ODZmMzZBZTBEOTZBQzUiLCJwdWJsaWNBZGRyZXNzIjoiMHgwM0Y5QzQzOTI2QkMzZDU5YkFkOEZjQmYxNTg2ZjM2QWUwRDk2QUM1IiwiZW1haWwiOiJrb3NhbWVodXJ1YXNhQGdtYWlsLmNvbSIsIm9hdXRoUHJvdmlkZXIiOm51bGwsInBob25lTnVtYmVyIjpudWxsLCJ3YWxsZXRzIjpbXSwiaWF0IjoxNjg0Nzg3ODU3LCJleHAiOjE2ODUzOTI2NTcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLXVzZXItaWQiOiJkaWQ6ZXRocjoweDAzRjlDNDM5MjZCQzNkNTliQWQ4RmNCZjE1ODZmMzZBZTBEOTZBQzUifX0.0vHhmStAnBsvD-QnFXkHDk4u-Xa7WdXnAAai6oyCKCA",
    res
  );

  const auth = req.headers.authorization;
  //   console.log(auth);
  const didToken = auth ? auth.substring(7) : "";
  if (req.method === "POST") {
    try {
      const metaData: MagicUserMetadata =
        await magicAdmin.users.getMetadataByToken(didToken); //MagicLinkからユーザー情報を取得＊サーバーサイド
      console.log({ metaData });

      const token = jwt.sign(
        {
          ...metaData,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-user-id": metaData.issuer,
          },
        },
        process.env.JWT_SECRET
      );

      console.log({ token });

      //check if the user exists
      const newUseFlag = await isNewUser(token, metaData.issuer!); //hasura からユーザーデータ取得できるかどうか
      newUseFlag && (await createNewUser(token, metaData)); //未登録ならhasuraに登録

      const cookie = setTokenCookie(token, res);

      res.status(200).json({ done: true });
    } catch (error) {
      res.status(500).json({ done: false });
    }
  } else {
  }
}
