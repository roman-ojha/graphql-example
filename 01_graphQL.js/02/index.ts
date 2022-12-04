import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema.js";

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
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log("Server Started");
});
