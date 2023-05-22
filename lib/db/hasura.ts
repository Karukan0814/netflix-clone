import { MagicUserMetadata } from "magic-sdk";

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
