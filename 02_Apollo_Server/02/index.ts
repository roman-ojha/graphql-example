import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createContext } from "./graphql/context.js";
import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/schema/index.js";

const server = new ApolloServer({
  typeDefs,
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
