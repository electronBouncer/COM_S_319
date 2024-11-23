//Anthony Phan
//asianp12@iastate.edu
//Nov 22, 2024

// Server
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

//MySQL
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

// Endpoint to get all contacts
app.get("/contact", async (req, res) => {
  try {
    db.query("SELECT * FROM contact", (err, result) => {
      if (err) {
        console.error({ error: "Error reading all contacts: " + err });
        return res
          .status(500)
          .send({ error: "Error reading all contacts: " + err });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    console.error({ error: "An unexpected error occurred: " + err });
    res.status(500).send({ error: "An unexpected error occurred: " + err });
  }
});

// Assuming you have other necessary middleware and server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
