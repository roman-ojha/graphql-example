import { buildSchema } from "graphql";
import client from "../config/db.js";

// GraphQL Schema
// Defining Model Type, Queries, Mutations
// https://medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1
const schema = buildSchema(`
  type User {
    id: Int!
    name: String!
    email: String!
    posts: [Post]
  },
  type Post {
    id: Int!
    caption: String
    user_id: Int!
  }
  type Query{
    user(id: Int!): User
    post(id: Int!): Post
  }
`);

/*
  Query:
    query getUser($id: Int!){
      user(id: $id){
        name,
        email,
      }
    }
    query getUserAndPost($userId1: Int!, $userId2: Int!, $postId: Int!){
      user1: user(id: $userId1){
        ...userFields
      },
      user2: user(id: $userId2){
        ...userFields
      },
      post(id: $postId){
        ...postFields
      }
    }

    fragment userFields on User{
      name,
      email
    }

    fragment postFields on Post{
      caption,
      user_id
    }

  Query Variables:
    query getUser($id: Int!){
    user(id: $id){
      name,
      email,
    }
}
*/

// Root resolver
const root = {
  async user(args) {
    try {
      const res = await client.query(`SELECT * FROM Users WHERE id=${args.id}`);
      return res.rows[0];
    } catch (err) {
      return null;
    }
  },
  async post(args) {
    try {
      const res = await client.query(`SELECT * FROM Posts WHERE id=${args.id}`);
      return res.rows[0];
    } catch (err) {
      return null;
    }
  },
};

export default {
  schema: schema,
  rootValue: root,
};
