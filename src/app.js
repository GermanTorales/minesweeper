require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const path = require("path");
const routes = require("./routes");
const app = express();

app.use("/public", express.static(path.join(__dirname, "/browser")));

app.use("/", routes);

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
