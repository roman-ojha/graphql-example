import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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
const resolver = {
  // for Query type
  Query: {
    users: (parent, args, context) => {
      return [
        {
          name: "Roman",
        },
      ];
    },
  },
};

// define the context
const context = {};

const server = new ApolloServer({
  // pass it on here
  typeDefs: typeDefs,
  // pass resolver
  resolvers: resolver,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// Starting server
await startStandaloneServer(server, {
  listen: { port: 8000 },
  context: async ({ req, res }) => {
    return {
      req,
      res,
    };
  },
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => {});
