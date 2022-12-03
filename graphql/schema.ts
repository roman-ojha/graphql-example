import {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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
        //     client.query(`SELECT * FROM Users WHERE id=${args.id}`, (err, res) => {
        //       if (err) {
        //         console.log(err);
        //       } else {
        //     }
        // });
        return lodash.find(users, { id: args.id });
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
        // client.query(`SELECT * FROM Posts WHERE id=${args.id}`, (err, res) => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     return;
        //   }
        // });
        return lodash.find(posts, { id: args.id });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return users;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return posts;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
