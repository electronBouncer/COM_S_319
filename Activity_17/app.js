/**
 * Author: Anthony Phan
 * ISU Netid: asianp12@iastate.edu
 * Date: NOV 9, 2024
 */

var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");

var app = express();
app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const person = {
  name: "alex",
  email: "alex@mail.com",
  job: "software dev",
};

app.get("/person", (req, res) => {
  const person = {
    name: "alex",
    email: "alex@mail.com",
    job: "software dev",
  };
  console.log(person);
  res.status(200);
  res.send(person);
});

app.get("/", (req, res) => {
  res.status(200);
  res.send(
    "<h1 style='color:Green;background-color:black;border: 0px; '>Hello World From Node </h1>"
  );
});