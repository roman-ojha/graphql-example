import pg from "pg";

const client = new pg.Client({
  user: process.env.DATABASEUSER,
  host: process.env.DATABASEHOST,
  database: process.env.DATABASENAME,
  password: process.env.DATABASEPASSWORD,
  port: parseInt(process.env.DATABASEPORT as string),
});

client
  .connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

export default client;
