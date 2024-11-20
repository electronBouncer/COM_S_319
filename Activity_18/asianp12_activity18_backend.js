//Anthony Phan
//asinap12@iastate.edu
//Nov 11, 2024


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

app.get("/listMovies", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    const query = {};
    const results = await db
      .collection("movie")
      .find(query)
      .limit(100)
      .toArray();
    console.log(results);

    res.status(200);
    res.send(results);
});

app.get("/:id", async (req, res) => {
    const movieId = req.params.id;
    console.log("Movie to find :", movieId);

    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");

    const query = { movieId: movieId };
    const results = await db.collection("movie").findOne(query);
    console.log("Results :", results);

    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
});

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
