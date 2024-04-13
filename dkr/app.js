
const express = require("express");
const app = express()

app.get("/docker", (req, res) => {
  res.json({ msg: "docker" });
})

app.listen(3001, () => {
  console.log("Docker on 3001");
});
