import { NextApiResponse } from "next";
import { Ms_Madi } from "next/font/google";

var cookie = require("cookie");

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token: string, res: NextApiResponse<any>) => {
  const setCookie = cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.setHeader("Set-Cookie", setCookie);
};
