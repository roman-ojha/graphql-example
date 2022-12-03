import pg from "pg";

const client = new pg.Client({
  user: process.env.DATABASEUSER,
  host: process.env.DATABASEHOST,
  database: process.env.DATABASENAME,
  password: process.env.DATABASEPASSWORD,
  //   port: process.env.DATABASEPORT,
  port: parseInt(process.env.DATABASEPORT as string),
});

client
  .connect()
  .then(() => {
    // Create User Table
    client.query(
      `
        create table users (
            id BIGSERIAL NOT NULL PRIMARY KEY,
            email VARCHAR(200) NOT NULL,
            name VARCHAR(200) NOT NULL,
            UNIQUE(email)
        );
      `,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      }
    );
    client.query(
      `
        CREATE TABLE posts(
            id SERIAL NOT NULL,
            caption TEXT,
            user_id BIGINT REFERENCES users(id),
            UNIQUE(user_id)
        );
      `,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      }
    );
  })
  .catch((err) => console.log(err));
