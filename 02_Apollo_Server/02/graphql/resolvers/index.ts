import Query from "./Query.js";
import Mutation from "./Mutation.js";
import User from "./model/User.js";
import Post from "./model/Post.js";
import { Resolvers } from "../generated/resolvers-types";

export default <Resolvers>{
  Query,
  Mutation,
  User,
  Post,
};
