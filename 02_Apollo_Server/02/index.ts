import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { connect } from "./config/db.js";
import { Resolvers } from "./graphql/generated/resolvers-types.js";
import { createContext } from "./graphql/context.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolver: Resolvers = {
  Query: {
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
  typeDefs: fs
    .readFileSync(path.join(__dirname, "/graphql/schema.graphql"))
    .toString(),
  resolvers: resolver,
});

connect();
startStandaloneServer(server, {
  listen: { port: 8000 },
  context: createContext,
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => {});
