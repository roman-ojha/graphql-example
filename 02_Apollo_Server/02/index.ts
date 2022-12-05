import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createContext } from "./graphql/context.js";
import resolvers from "./graphql/resolvers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
  typeDefs: fs
    .readFileSync(path.join(__dirname, "/graphql/schema.graphql"))
    .toString(),
  resolvers,
});

import "./config/db.js";

startStandaloneServer(server, {
  listen: { port: 8000 },
  context: createContext,
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => {});
