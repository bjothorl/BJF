const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

app.use("/static", express.static("static"));
app.use("/api/calcroute", require("./calcroute.js"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "Index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
