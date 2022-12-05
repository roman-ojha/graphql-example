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
  user: async (_, args, ctx, info) => {
    try {
      const res = await ctx.db.query(`SELECT * FROM Users WHERE id=${args.id}`);
      return res.rows[0];
    } catch (err) {
      return null;
    }
  },
};
