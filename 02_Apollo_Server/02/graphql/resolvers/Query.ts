import { QueryResolvers } from "../generated/resolvers-types";

export default <QueryResolvers>{
  users: async (_, __, ctx, info) => {
    try {
      const res = await ctx.db.query(`SELECT * FROM Users`);
      return res.rows;
    } catch (err) {
      return null;
    }
  },
};
