const express = require("express");
const path = require("path");
let db = require("./db/db.json");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const uuid = require("./helpers/uuid");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/api/notes", (req, res) => {
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  req.body.id = uuid();
  db.push(req.body);
  fs.writeFileSync("./db/db.json", JSON.stringify(db, null, "\t"));
  res.json(db);
});

app.delete("/api/notes/:id", (req, res) => {
  const userid = req.params.id;
  for (let i = 0; i < db.length; i++) {
    if (userid === db[i].id) {
      db.splice(i, 1);
    }
  }
  fs.writeFileSync("./db/db.json", JSON.stringify(db, null, "\t"));
  res.json(db);
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.log("App listening at http://localhost:${PORT}")
);
