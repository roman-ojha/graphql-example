import { ApolloServer } from "@apollo/server";
import {
  startStandaloneServer,
  StandaloneServerContextFunctionArgument,
} from "@apollo/server/standalone";
import fs from "fs";
import path, { dirname } from "path";
import { Client } from "pg";
import { fileURLToPath } from "url";
import client, { connect } from "./config/db.js";

// importing types generate from .graphql
import { User, Resolvers } from "./graphql/generated/resolvers-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define a Graphql Types
const typeDefs = `#graphql
  "this is a description for User"
  type User {
    "this is an description for id"
    id: Int!
    name: String!
    email: String!
    posts: [Post]
  }

  type Post {
    id: Int!
    caption: String
    user_id: User!
  }

  type Query {
    users: [User]
    posts: [Post]
    user: User
    post: Post
  }

  type Mutation {
    addUser(name: String, email: String): User
    addPost(caption: String, user_id: Int): Post
  }
`;

// define the resolver
// we can use the resolver that get generated
const resolver: Resolvers = {
  // for Query type
  Query: {
    // users: async (parent, args: User, ctx: Context) => {
    //   // 'User' is the type that is generated from graphql
    //   try {
    //     const res = await ctx.db.query(`SELECT * FROM Users`);
    //     return res.rows;
    //   } catch (err) {
    //     return null;
    //   }
    // },
    users: async (_, __, ctx, info) => {
      try {
        const res = await ctx.db.query(`SELECT * FROM Users`);
        return res.rows;
      } catch (err) {
        return null;
      }
    },
  },
};

const server = new ApolloServer({
  // pass it on here
  // typeDefs: typeDefs,
  // you can also pass the '.graphql' || '.gql' file extension typeDefs here
  typeDefs: fs
    .readFileSync(path.join(__dirname, "/graphql/schema.graphql"))
    .toString(),
  // pass resolver
  resolvers: resolver,
});

// define the context
type Request = StandaloneServerContextFunctionArgument["req"];
type Response = StandaloneServerContextFunctionArgument["res"];
export interface Context {
  req: Request;
  res: Response;
  db: Client;
}
const context = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => {
  // we will pass postgresql DB client object into context
  return {
    req,
    res,
    db: client,
  };
};

// Database connected
connect();

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// Starting server
startStandaloneServer(server, {
  listen: { port: 8000 },
  // context: async ({ req, res }) => {
  //   // accessing req and response inside context
  //   return {
  //     req,
  //     res,
  //   };
  // },
  context,
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => {});
