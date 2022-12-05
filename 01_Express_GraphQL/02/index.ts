import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema.js";
import type pg from "pg";
import client from "./config/db.js";

const port = process.env.PORT || 8000;
const app = express();

// Database
import "./config/db.js";

// using graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema.schema,
    rootValue: schema.rootValue,
    context: () => {
      return {
        hello: "",
        db: client,
      };
    },
    graphiql: true,
  })
);

// we will create a type of context so that we can specify on resolver
export interface Context {
  hello: string;
  db: pg.Client;
}

app.listen(port, () => {
  console.log("Server Started");
});
