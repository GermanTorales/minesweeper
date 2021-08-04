const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "browser")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3030, () => console.log(`Server on port 3030`));
