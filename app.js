const express = require("express");
const path = require("path");
var app = express();
const PORT = process.env.PORT || 3002;
let db = require('./db.json');
let ids = db.map(post => post.id);
const fs = require('fs');

//- Setup Express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/note", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('/api/notes', function (req, res) {
  res.json(db);
});

app.delete('/api/notes/:id', function (req, res) {
  const id = req.params.id;
  db = db.filter(post => post.id !== id)
  fs.writeFile("./db.json", JSON.stringify(db), "utf8", err => {
    if(err)throw(err);
  });
  //res.redirect("/note");
});

app.post('/api/notes', function (req, res) {
  var data = req.body;
  var myid = 1;
  while(ids.includes(myid)) {
    myid ++;
  }
  data.id = myid;
  db.push(data);
  fs.writeFile("./db.json", JSON.stringify(db), "utf8", err => {
    if(err)throw(err);
  });
  res.redirect("/note");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

