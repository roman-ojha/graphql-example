import { buildSchema } from "graphql";
import client from "../config/db.js";

// GraphQL Schema
// Defining Model Type, Queries, Mutations
// https://medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1
// https://www.moonhighway.com/articles/the-parent-argument/
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
    users: [User]
    posts: [Post]
  }
  type Mutation{
    addUser(name: String!, email: String!): User
    addPost(caption: String, user_id: Int!): Post
  }
`);

// Class implementation for User GraphQL Object type
class User {
  private id: number;
  private name: string;
  private email: string;
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  async posts() {
    // getting post data and returning it
    try {
      const res = await client.query(
        `SELECT * FROM Posts WHERE user_id=${this.id}`
      );
      return res.rows;
    } catch (err) {
      return null;
    }
  }
}

// Root resolver
const rootResolver = {
  async user(args) {
    try {
      const res = await client.query(`SELECT * FROM Users WHERE id=${args.id}`);
      return new User(res.rows[0].id, res.rows[0].name, res.rows[0].email);
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
  async users() {
    try {
      const res = await client.query(`SELECT * FROM Users`);
      return res.rows;
    } catch (err) {
      return null;
    }
  },
  async posts() {
    try {
      const res = await client.query(`SELECT * FROM Posts`);
      return res.rows;
    } catch (err) {
      return null;
    }
  },
  async addUser(args) {
    try {
      const sql = "INSERT INTO users(name,email) VALUES($1, $2)";
      const value = [args.name, args.email];
      const res = await client.query(sql, value);
      return {
        name: args.name,
        email: args.email,
      };
    } catch (err) {
      return null;
    }
  },
  async addPost(args) {
    try {
      const sql = "INSERT INTO posts(caption,user_id) VALUES($1, $2)";
      const value = [args.caption, args.user_id];
      const res = await client.query(sql, value);
      return res.rows[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

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
    mutation addNewUser($newUserName: String!, $newUserGmail: String!){
      addUser(name: $newUserName, email: $newUserGmail){
        ...userFields
      }
    
    },
    mutation addNewPost($userPostCaption: String, $postOnUserId: Int!){
      addPost(caption: $userPostCaption, user_id: $postOnUserId){
        ...postFields
      }  
    }

  Query Variables:
    {
    "id": 21,
    "userId1": 1,
    "userId2": 21,
    "postId": 1,
    "newUserName": "Harry",
    "newUserGmail": "harry@gmail.com",
    "userPostCaption": "This is from jack",
    "postOnUserId": 21
  }
*/

export default {
  schema: schema,
  rootValue: rootResolver,
};
