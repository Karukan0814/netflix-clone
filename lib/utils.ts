var jwt = require("jsonwebtoken");

export async function redirectUser(token: string | undefined) {
  //tokenもしくはuserIdが取得できない＝loginできていない　ときはログイン画面にリダイレクト
  let userId = null;

  if (token) {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET); //tokenをでコード
    userId = decoded.issuer;
  }
  if (!token || !userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return userId;
}
