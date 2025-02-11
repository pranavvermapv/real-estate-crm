import express from "express"
import cors from "cors"
import pkg from "pg"
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import fs from "fs";

const { Pool } = pkg
dotenv.config();

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ensure the 'uploads' directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Multer Storage Configuration (Only PDFs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

// File Filter to Allow Only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

// Upload Middleware
const upload = multer({ storage, fileFilter });

// Upload PDF API
app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded!" });
  }

  const { originalname, filename } = req.file;
  const filePath = `${uploadDir}/${filename}`;

  try {
    const result = await pool.query(
      "INSERT INTO documents (name, file_path) VALUES ($1, $2) RETURNING *",
      [originalname, filePath]
    );
    res.status(201).json({ message: "PDF uploaded successfully!", data: result.rows[0] });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to save PDF file path." });
  }
});

// Get All Uploaded PDFs
app.get("/api/documents", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Failed to retrieve documents." });
  }
});

// Serve Static Files (PDFs)
app.use("/uploads", express.static(uploadDir));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Leads API
app.get("/api/leads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while fetching leads" })
  }
})

app.post("/api/leads", async (req, res) => {
  const { name, phone_number } = req.body
  console.log("Received data:", { name, phone_number }) // Log received data
  if (!name || !phone_number) {
    return res.status(400).json({ error: "Name and phone number are required" })
  }
  try {
    console.log("Attempting to insert data into the database")
    const result = await pool.query("INSERT INTO leads (name, phone_number) VALUES ($1, $2) RETURNING *", [
      name,
      phone_number,
    ])
    console.log("Insert result:", result.rows[0]) // Log insert result
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error("Error during database insertion:", err)
    res.status(500).json({ error: "An error occurred while creating the lead" })
  }
})

app.put("/api/leads/:id", async (req, res) => {
  const { id } = req.params
  const { name, phone_number } = req.body
  try {
    const result = await pool.query("UPDATE leads SET name = $1, phone_number = $2 WHERE id = $3 RETURNING *", [
      name,
      phone_number,
      id,
    ])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lead not found" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while updating the lead" })
  }
})

app.delete("/api/leads/:id", async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query("DELETE FROM leads WHERE id = $1", [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lead not found" })
    }
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while deleting the lead" })
  }
})

// Properties API
app.get("/api/properties", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM properties")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while fetching properties" })
  }
})

app.post("/api/properties", async (req, res) => {
  const { type, size, location, budget, availability } = req.body
  if (!type || !size || !location || !budget || !availability) {
    return res.status(400).json({ error: "All fields are required" })
  }
  try {
    const result = await pool.query(
      "INSERT INTO properties (type, size, location, budget, availability) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [type, size, location, budget, availability],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while creating the property" })
  }
})

app.put("/api/properties/:id", async (req, res) => {
  const { id } = req.params
  const { type, size, location, budget, availability } = req.body
  try {
    const result = await pool.query(
      "UPDATE properties SET type = $1, size = $2, location = $3, budget = $4, availability = $5 WHERE id = $6 RETURNING *",
      [type, size, location, budget, availability, id],
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Property not found" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while updating the property" })
  }
})

app.delete("/api/properties/:id", async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query("DELETE FROM properties WHERE id = $1", [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Property not found" })
    }
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while deleting the property" })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})