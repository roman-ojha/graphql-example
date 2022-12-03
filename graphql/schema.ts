import graphql, { GraphQLSchema } from "graphql";
import client from "../config/db.js";

const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

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
            console.log(err);
          } else {
            console.log(args);
            return {
              id: 1,
              name: "Roman",
              email: "roman@gmail.com",
            };
          }
        });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
