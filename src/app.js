require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const path = require("path");
const app = express();

app.use("/public", express.static(path.join(__dirname, "/browser")));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/styles.css", (req, res) => {
  res.setHeader("Content-Type", "text/css,*/*;q=0.1");
  res.sendFile(path.join(__dirname, "browser/styles.css"));
});

app.get("/minesweeper.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "browser/minesweeper.js"));
});

app.use((err, req, res, next) => {
  res.status(404).json({
    status: res.statusCode,
    data: err.message,
    message: "Not Found",
  });
});

if (process.env.NODE_ENV === "prod") {
  module.exports.handler = serverless(app);
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server on port: ${PORT}`));
}
