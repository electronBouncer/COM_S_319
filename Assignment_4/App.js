//Anthony Phan
//asianp12@iastate.edu
//Nov 22, 2024

var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db = client.db(dbName);

const port = "8081";
const host = "localhost";

app.get("/listRobots", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");

  const query = {};
  const results = await db.collection("robot").find(query).limit(100).toArray();
  console.log(results);

  res.status(200);
  res.send(results);
});

app.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  console.log("Robot to find :", movieId);
  // Add your logic to find the robot by id
});

app.post("/newContact", async (req, res) => {
  const contact = req.body;

  // Check if /uploads folder exists, if not create it
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Add your logic to save the contact data
  console.log("New contact received:", contact);

  res.status(201).send("Contact created");
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});