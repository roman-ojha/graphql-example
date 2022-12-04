import {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from "graphql";
import client from "../config/db.js";

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
      async resolve(parent, args) {
        try {
          const res = await client.query(
            `SELECT * FROM Posts WHERE user_id=${parent.id}`
          );
          return res.rows;
        } catch (err) {
          return null;
        }
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
      async resolve(parent, args) {
        console.log(parent);
        try {
          const res = await client.query(
            `SELECT * FROM users WHERE id=${parent.user_id}`
          );
          return res.rows[0];
        } catch (err) {
          return null;
        }
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
      async resolve(parent, args) {
        try {
          const res = await client.query(
            `SELECT * FROM Users WHERE id=${args.id}`
          );
          return res.rows[0];
        } catch (err) {
          return null;
        }
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      async resolve(parent, args) {
        try {
          const res = await client.query(
            `SELECT * FROM Posts WHERE id=${args.id}`
          );
          return res.rows[0];
        } catch (err) {
          return null;
        }
      },
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        try {
          const res = await client.query(`SELECT * FROM Users`);
          return res.rows;
        } catch (err) {
          return null;
        }
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent, args) {
        try {
          const res = await client.query(`SELECT * FROM Posts`);
          return res.rows;
        } catch (err) {
          return null;
        }
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
        try {
          const sql = "INSERT INTO users(name,email) VALUES($1, $2)";
          const value = [args.name, args.email];
          const res = await client.query(sql, value);
          return res.rows[0];
        } catch (err) {
          return null;
        }
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
        try {
          const sql = "INSERT INTO posts(caption,user_id) VALUES($1, $2)";
          const value = [args.caption, args.user_id];
          const res = await client.query(sql, value);
          return res.rows[0];
        } catch (err) {
          return null;
        }
      },
    },
    add: {
      // mutation to add new User and it's post
      type: UserType,
      args: {
        name: {
          type: GraphQLString,
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        // post: {
        //   // type: new GraphQLInputObjectType({
        //   //   name: "Post",
        //   //   fields() {
        //   //     return {
        //   //       caption: {
        //   //         type: GraphQLString,
        //   //       },
        //   //     };
        //   //   },
        //   // }),
        //   // type: PostType,
        // },
      },
      resolve(parent, args) {
        console.log(args);
        return args;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
