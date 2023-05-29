import { MagicUserMetadata } from "magic-sdk";
import { VideoInfoStats } from "../type/videoInfo";

export async function getMyListbyUserId(token: string, userId: string) {
  const operation = `
  query getMyListbyUserId ($userId: 
    String!){
    stats(where: {userId: {_eq: $userId}, favorited: {_eq: 1}}) {
      favorited
      userId
      videoId
      watched
    }
  }
`;

  const response = await fetchGraphQL(
    operation,
    "getMyListbyUserId",
    { userId },
    token
  );
  if (response.data && response.data.stats) {
    const resVideoInfos: VideoInfoStats[] = response?.data?.stats;
    return resVideoInfos;
  } else {
    return null;
  }
}

export async function getWatchedVideobyUser(token: string, userId: string) {
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
  if (response.data && response.data.stats) {
    const resVideoInfos: VideoInfoStats[] = response?.data?.stats;
    return resVideoInfos;
  } else {
    return null;
  }
}

export async function insertStats(
  token: string,
  userId: string,
  favorited: number,
  watched: boolean,
  videoId: string
) {
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
  return insetData;
}

export async function updateStats(
  token: string,
  userId: string,
  favorited: number,
  watched: boolean,
  videoId: string
) {
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
  const response = await fetchGraphQL(
    operationsDoc,
    "updateStats",
    { favorited, userId, watched, videoId },
    token
  );

  const updateRowData: VideoInfoStats[] = response.data.update_stats.returning;
  return updateRowData;
}

export async function findVideobyUser(
  token: string,
  userId: string,
  videoId: string
) {
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
  if (response && response.data) {
    const resVideoInfos: VideoInfoStats[] = response?.data?.stats;
    return resVideoInfos;
  } else {
    return null;
  }
}

export async function createNewUser(
  token: string,
  metadata: MagicUserMetadata
) {
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

  return response?.data?.users?.length === 0;
}

export async function isNewUser(token: string, issuer: string) {
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
  return response?.data?.users?.length === 0;
}

function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>,
  token: string
) {
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
