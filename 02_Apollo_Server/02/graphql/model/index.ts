import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readSchema = (relativePath: string): string => {
  return fs.readFileSync(path.join(__dirname, relativePath)).toString();
};

const typeDefs = `
${readSchema("/User.graphql")}
${readSchema("/Post.graphql")}
${readSchema("../schema.graphql")}
`;

export default typeDefs;
