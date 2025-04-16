import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql.ts";

const client = new GraphQLClient(`${process.env.KIBELA_ORIGIN}/api/v1`, {
  headers: {
    Authorization: `Bearer ${process.env.KIBELA_ACCESS_TOKEN}`,
  },
});

const sdk = getSdk(client);

export { sdk as kibela };
