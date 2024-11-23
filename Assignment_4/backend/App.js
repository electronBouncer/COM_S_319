//Anthony Phan
//asianp12@iastate.edu
//Nov 14, 2024

var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// // MongoDB
// const { MongoClient } = require("mongodb");
// const url = "mongodb://127.0.0.1:27017";
// const dbName = "secoms3190";
// const client = new MongoClient(url);
// const db = client.db(dbName);

// MySQL
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "antphan",
  password: "Cyclone2025!",
  database: "secoms3190",
});

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });
// Create "uploads" folder if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.get("/contact", (req, res) => {
  try {
    db.query("SELECT * FROM contact", (err, result) => {
      if (err) {
        console.error({ error: "Error reading all posts:" + err });
        return res
          .status(500)
          .send({ error: "Error reading all contacts" + err });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    console.error({ error: "An unexpected error occurred" + err });
    res.status(500).send({ error: "An unexpected error occurred" + err });
  }
});
