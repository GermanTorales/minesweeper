const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../index.html"));
});

router.get("/styles.css", (req, res) => {
  res.setHeader("Content-Type", "text/css,*/*;q=0.1");
  res.sendFile(path.join(__dirname, "../browser/styles.css"));
});

router.get("/minesweeper.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "../browser/minesweeper.js"));
});

module.exports = router;
