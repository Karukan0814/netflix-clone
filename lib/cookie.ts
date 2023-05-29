import { NextApiResponse } from "next";

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

export const removeTokenCookie = (res: NextApiResponse<any>) => {
  console.log("removeTokenCookie");
  const setCookie = cookie.serialize("token", null, {
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", setCookie);
};
