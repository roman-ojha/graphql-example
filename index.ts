import express from "express";

const port = process.env.PORT || 8000;
const app = express();

// Database
import "./config/db.js";

app.listen(port, () => {
  console.log("Server Started");
});
