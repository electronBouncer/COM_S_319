// Anthony Phan
// asianp12@iastate.edu
// Nov 22, 2024

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

// MySQL
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "antphan",
  password: "Cyclone2025!",
  database: "secoms3190"
});

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const port = "8081";
const host = "localhost";

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

app.get("/contact", (req, res) => {
  try {
    db.query("SELECT * FROM contact", (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(result);
    });
  } catch (err) {
    const errorMessage = `An unexpected error occurred: ${err.message}`;
    console.error({ error: errorMessage });
    res.status(500).send({ error: errorMessage });
  }
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});