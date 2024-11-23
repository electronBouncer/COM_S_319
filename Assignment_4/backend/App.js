//Anthony Phan
//asianp12@iastate.edu
//Nov 14, 2024

var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");

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

  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");

  const query = { movieId: movieId };
  const results = await db.collection("robot").findOne(query);
  console.log("Results :", results);

  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.post("/robot", async (req, res) => {
  try {
    // Check if the request body exists and is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Bad request: No data provided." });
    }

    await client.connect();

    const newDocument = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    };
    console.log(newDocument);

    // Assuming 'id' should be unique
    const existingDoc = await db
      .collection("robot")
      .findOne({ id: newDocument.id });
    if (existingDoc) {
      return res
        .status(409)
        .send({ error: "Conflict: A robot with this ID already exists." });
    }

    const results = await db.collection("robot").insertOne(newDocument);

    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.delete("/robot/:id", async (req, res) => {
  try {
    // Read parameter id
    const id = Number(req.params.id);
    console.log("Robot to delete :", id);

    // Connect to MongoDB
    await client.connect();

    // Define the query to find the robot by its id
    const query = { id: id };

    // Find the robot to be deleted
    const robotDeleted = await db.collection("robot").findOne(query);
    if (!robotDeleted) {
      return res.status(404).send({ error: "Robot not found" });
    }

    // Delete the robot
    const results = await db.collection("robot").deleteOne(query);
    console.log("Results :", results);

    // Response to Client with the deleted robot data
    res.status(200).send(robotDeleted);
  } catch (error) {
    console.error("Error deleting robot:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.put("/robot/:id", async (req, res) => {
  try {
    const id = Number(req.params.id); // Read parameter id
    console.log("Robot to Update :", id);

    await client.connect(); // Connect to MongoDB

    const query = { id: id }; // Update by its id

    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
      $set: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
      },
    };

    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};

    // Update the robot
    const results = await db
      .collection("robot")
      .updateOne(query, updateData, options);
    console.log("Update Results :", results);

    // Find the updated robot
    const robotUpdated = await db.collection("robot").findOne(query);

    // Response to Client with the updated robot data
    res.status(200).send(robotUpdated);
  } catch (error) {
    console.error("Error updating robot:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});