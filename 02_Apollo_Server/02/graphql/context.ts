import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import client from "../config/db.js";
import { Client } from "pg";

type Request = StandaloneServerContextFunctionArgument["req"];
type Response = StandaloneServerContextFunctionArgument["res"];
export interface Context {
  req: Request;
  res: Response;
  db: Client;
}

export async function createContext({
  req,
  res,
}: StandaloneServerContextFunctionArgument): Promise<Context> {
  return {
    req,
    res,
    db: client,
  };
}
