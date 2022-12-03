import {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull,
} from "graphql";
import client from "../config/db.js";

import lodash from "lodash";

const users = [
  {
    id: 1,
    name: "Roman",
    email: "roman@gmail.com",
  },
  {
    id: 2,
    name: "Razz",
    email: "razz@gmail.com",
  },
];

const posts = [
  {
    id: 1,
    caption: "Hello world",
    user_id: 1,
  },
  {
    id: 2,
    caption: "Hello Roman",
    user_id: 1,
  },
  {
    id: 3,
    caption: "Next level",
    user_id: 2,
  },
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return lodash.filter(posts, { user_id: parent.id });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    caption: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
      resolve(parent, args) {
        return lodash.find(users, { id: parent.user_id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve(parent, args) {
        client.query(`SELECT * FROM Users WHERE id=${args.id}`, (err, res) => {
          if (err) {
            return null;
          } else {
            return res.rows[0];
          }
        });
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve(parent, args) {
        client.query(`SELECT * FROM Posts WHERE id=${args.id}`, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            return res.rows[0];
          }
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        var result: any = "";
        try {
          const res = client.query(`SELECT * FROM Users;`);
          console.log(result);
          return result;
        } catch (err) {}
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        client.query(`SELECT * FROM Posts`, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            return res.rows;
          }
        });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parent, args) {
        const sql = "INSERT INTO users(name,email) VALUES($1, $2)";
        const value = [args.name, args.email];
        client.query(sql, value, (err, res) => {
          if (err) {
            return null;
          } else {
            return res;
          }
        });
      },
    },
    addPost: {
      type: PostType,
      args: {
        caption: {
          type: GraphQLString,
        },
        user_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      async resolve(parent, args) {
        const sql = "INSERT INTO posts(caption,user_id) VALUES($1, $2)";
        const value = [args.caption, args.user_id];
        client.query(sql, value, (err, res) => {
          if (err) {
            return null;
          } else {
            return res;
          }
        });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
