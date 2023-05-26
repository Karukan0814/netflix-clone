import { MagicUserMetadata } from "magic-sdk";
import { VideoInfoStats } from "../type/videoInfo";

export async function getWatchedVideobyUser(token: string, userId: string) {
  console.log("getWatchedVideobyUser");
  const operation = `
  query getWatchedVideo ($userId: 
    String!){
    stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
      favorited
      userId
      videoId
      watched
    }
  }
`;

  const response = await fetchGraphQL(
    operation,
    "getWatchedVideo",
    { userId },
    token
  );
  console.log(response?.data);
  const resVideoInfos: VideoInfoStats[] = response?.data?.stats;
  return resVideoInfos;
}

export async function insertStats(
  token: string,
  userId: string,
  favorited: number,
  watched: boolean,
  videoId: string
) {
  console.log("insertStats");
  const operationsDoc = `
  mutation insertStats($favorited: Int!, $userId: 
  String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {favorited: $favorited,  userId: $userId, videoId: $videoId, watched: $watched}) {
      favorited
      id
      userId
      videoId
      watched
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "insertStats",
    { favorited, userId, videoId, watched },
    token
  );
  const insetData: VideoInfoStats = response.data.insert_stats_one;
  console.log(insetData);
  return insetData;
}

export async function updateStats(
  token: string,
  userId: string,
  favorited: number,
  watched: boolean,
  videoId: string
) {
  console.log("updateStats");
  const operationsDoc = `
  mutation updateStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {favorited: $favorited, watched: $watched}) {
      affected_rows
      returning {
        favorited
        id
        userId
        videoId
        watched
      }
    }
  }
`;
  console.log({ favorited, userId, watched, videoId });
  const response = await fetchGraphQL(
    operationsDoc,
    "updateStats",
    { favorited, userId, watched, videoId },
    token
  );

  const updateRowData: VideoInfoStats[] = response.data.update_stats.returning;
  console.log(updateRowData);
  return updateRowData;
}

export async function findVideobyUser(
  token: string,
  userId: string,
  videoId: string
) {
  console.log("findVideobyUser");
  const operation = `
  query findVideo($userId:String!,$videoId:String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      userId
      favorited
      videoId
      watched
    }
  }
`;

  const response = await fetchGraphQL(
    operation,
    "findVideo",
    { userId, videoId },
    token
  );
  console.log(response?.data);
  const resVideoInfos: VideoInfoStats[] = response?.data?.stats;
  return resVideoInfos;
}

export async function createNewUser(
  token: string,
  metadata: MagicUserMetadata
) {
  console.log("createNewUser");
  const operationsDoc = `
  mutation insertUser($email:String!,$issuer:String!,$publicAddress:String!) {
    insert_users(objects: {email: $email, issuer: $issuer,  publicAddress: $publicAddress}) {
      affected_rows
      returning {
        email
        issuer
        publicAddress
      }
    }
  }
`;
  const { issuer, email, publicAddress } = metadata;
  const response = await fetchGraphQL(
    operationsDoc,
    "insertUser",
    { email, issuer, publicAddress },
    token
  );

  console.log(response.data);
  return response?.data?.users?.length === 0;
}

export async function isNewUser(token: string, issuer: string) {
  console.log("isNewUser");
  const operation = `
    query isNewUser($issuer:String!) {
        users(where: {issuer: {_eq: $issuer}}) {
          issuer
          name
          publicAddress
        }
      }
      `;

  const response = await fetchGraphQL(
    operation,
    "isNewUser",
    { issuer },
    token
  );
  console.log(response?.data);
  return response?.data?.users?.length === 0;
}

function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>,
  token: string
) {
  console.log(process.env.NEXT_PUBLIC_HASURA_URL);
  return fetch(process.env.NEXT_PUBLIC_HASURA_URL!, {
    method: "POST",
    headers: {
      //   "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables,
      operationName,
    }),
  }).then((result) => result.json());
}
