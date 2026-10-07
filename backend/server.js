const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});


const formatHotel = (row) => {
  if (!row) return null;
  const suitableFor = Array.isArray(row.suitable_for)
    ? row.suitable_for
    : typeof row.suitable_for === "string"
    ? JSON.parse(row.suitable_for)
    : [];
  const amenities = Array.isArray(row.amenities)
    ? row.amenities
    : typeof row.amenities === "string"
    ? JSON.parse(row.amenities)
    : [];
  const roomImages = Array.isArray(row.room_images)
    ? row.room_images
    : typeof row.room_images === "string"
    ? JSON.parse(row.room_images)
    : [];

  let formattedImage = row.image || "";
  if (formattedImage.startsWith("/uploads/")) {
    formattedImage = `http://localhost:${PORT}${formattedImage}`;
  } else if (formattedImage.startsWith("uploads/")) {
    formattedImage = `http://localhost:${PORT}/${formattedImage}`;
  }

  return {
    id: row.id,
    name: row.name || row.title || "Unnamed Hotel",
    title: row.title || row.name || "Unnamed Hotel",
    price: Number(row.price) || 0,
    description: row.description || "",
    image: formattedImage,
    latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
    longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
    rating: row.rating !== null && row.rating !== undefined ? Number(row.rating) : 4.0,
    location: row.location || "",
    roomType: row.room_type || "Standard Room",
    room_type: row.room_type || "Standard Room",
    offer: row.offer !== null && row.offer !== undefined ? Number(row.offer) : 0,
    suitableFor,
    suitable_for: suitableFor,
    amenities,
    roomImages,
    room_images: roomImages,
  };
};


app.get("/", (req, res) => {
  res.send("Hotel Backend is running with Multer upload support");
});


app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time, current_database() as database_name");
    res.json({
      status: "connected",
      database: result.rows[0].database_name,
      serverTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Health check error:", error.message);
    res.status(500).json({ status: "disconnected", error: error.message });
  }
});



app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const relativePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    console.log(`📸 Image uploaded successfully: ${req.file.filename} -> ${relativePath}`);

    res.status(200).json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
      filePath: relativePath,
      url: fullUrl,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});


app.get("/api/hotels", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hotels ORDER BY id ASC");
    const formatted = result.rows.map(formatHotel);
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/hotels/:identifier", async (req, res) => {
  const { identifier } = req.params;
  const isNumeric = /^\d+$/.test(identifier);

  try {
    const query = isNumeric
      ? "SELECT * FROM hotels WHERE id = $1"
      : "SELECT * FROM hotels WHERE LOWER(name) = LOWER($1) OR LOWER(title) = LOWER($1)";
    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(formatHotel(result.rows[0]));
  } catch (error) {
    console.error(`Error fetching hotel ${identifier}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/hotels", upload.single("image"), async (req, res) => {
  const {
    name,
    title,
    price,
    description,
    image,
    latitude,
    longitude,
    rating,
    location,
    roomType,
    room_type,
    offer,
    suitableFor,
    suitable_for,
    amenities,
    roomImages,
    room_images,
  } = req.body;

  const hotelName = (name || title || "").trim();
  if (!hotelName) {
    return res.status(400).json({ error: "Hotel name is required" });
  }

  
  let finalImagePath = image || "";
  if (req.file) {
    finalImagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const hotelPrice = Number(price) || 0;
  const hotelLat = latitude !== undefined && latitude !== "" ? Number(latitude) : null;
  const hotelLng = longitude !== undefined && longitude !== "" ? Number(longitude) : null;
  const hotelRating = rating !== undefined ? Number(rating) : 4.5;
  const hotelRoomType = roomType || room_type || "Deluxe Room";
  const hotelOffer = offer !== undefined ? Number(offer) : 0;

  const parseOrArray = (val, fallback) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  const hotelSuitableFor = JSON.stringify(
    parseOrArray(suitableFor || suitable_for, ["Luxury", "Family"])
  );
  const hotelAmenities = JSON.stringify(
    parseOrArray(amenities, ["Free Wi-Fi", "Room Service", "Free Parking"])
  );
  const hotelRoomImages = JSON.stringify(
    parseOrArray(roomImages || room_images, finalImagePath ? [finalImagePath] : [])
  );

  try {
    const result = await pool.query(
      `INSERT INTO hotels (
        name, title, price, description, image, latitude, longitude,
        rating, location, room_type, offer, suitable_for, amenities, room_images
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING *`,
      [
        hotelName,
        hotelName,
        hotelPrice,
        description || "",
        finalImagePath,
        hotelLat,
        hotelLng,
        hotelRating,
        location || "",
        hotelRoomType,
        hotelOffer,
        hotelSuitableFor,
        hotelAmenities,
        hotelRoomImages,
      ]
    );

    console.log(`✅ Hotel created in DB with image path: ${finalImagePath}`);
    res.status(201).json(formatHotel(result.rows[0]));
  } catch (error) {
    console.error("Error creating hotel:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.put("/api/hotels/:identifier", upload.single("image"), async (req, res) => {
  const { identifier } = req.params;
  const isNumeric = /^\d+$/.test(identifier);

  const {
    name,
    title,
    price,
    description,
    image,
    latitude,
    longitude,
    rating,
    location,
    roomType,
    room_type,
    offer,
    suitableFor,
    suitable_for,
    amenities,
    roomImages,
    room_images,
  } = req.body;

  let finalImagePath = image !== undefined ? image : null;
  if (req.file) {
    finalImagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const newName = name || title;
  const newRoomType = roomType || room_type;

  const parseOrNull = (val) => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) return JSON.stringify(val);
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify(val);
    }
  };

  const newSuitableFor = parseOrNull(suitableFor || suitable_for);
  const newAmenities = parseOrNull(amenities);
  const newRoomImages = parseOrNull(roomImages || room_images);

  try {
    const updateQuery = isNumeric
      ? `UPDATE hotels SET
          name = COALESCE($1, name),
          title = COALESCE($1, title),
          price = COALESCE($2, price),
          description = COALESCE($3, description),
          image = COALESCE($4, image),
          latitude = COALESCE($5, latitude),
          longitude = COALESCE($6, longitude),
          rating = COALESCE($7, rating),
          location = COALESCE($8, location),
          room_type = COALESCE($9, room_type),
          offer = COALESCE($10, offer),
          suitable_for = COALESCE($11::jsonb, suitable_for),
          amenities = COALESCE($12::jsonb, amenities),
          room_images = COALESCE($13::jsonb, room_images)
        WHERE id = $14
        RETURNING *`
      : `UPDATE hotels SET
          name = COALESCE($1, name),
          title = COALESCE($1, title),
          price = COALESCE($2, price),
          description = COALESCE($3, description),
          image = COALESCE($4, image),
          latitude = COALESCE($5, latitude),
          longitude = COALESCE($6, longitude),
          rating = COALESCE($7, rating),
          location = COALESCE($8, location),
          room_type = COALESCE($9, room_type),
          offer = COALESCE($10, offer),
          suitable_for = COALESCE($11::jsonb, suitable_for),
          amenities = COALESCE($12::jsonb, amenities),
          room_images = COALESCE($13::jsonb, room_images)
        WHERE LOWER(name) = LOWER($14) OR LOWER(title) = LOWER($14)
        RETURNING *`;

    const result = await pool.query(updateQuery, [
      newName || null,
      price !== undefined && price !== "" ? Number(price) : null,
      description !== undefined ? description : null,
      finalImagePath,
      latitude !== undefined && latitude !== "" ? Number(latitude) : null,
      longitude !== undefined && longitude !== "" ? Number(longitude) : null,
      rating !== undefined ? Number(rating) : null,
      location !== undefined ? location : null,
      newRoomType || null,
      offer !== undefined ? Number(offer) : null,
      newSuitableFor,
      newAmenities,
      newRoomImages,
      identifier,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json(formatHotel(result.rows[0]));
  } catch (error) {
    console.error(`Error updating hotel ${identifier}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});


app.delete("/api/hotels/:identifier", async (req, res) => {
  const { identifier } = req.params;
  const isNumeric = /^\d+$/.test(identifier);

  try {
    const query = isNumeric
      ? "DELETE FROM hotels WHERE id = $1 RETURNING *"
      : "DELETE FROM hotels WHERE LOWER(name) = LOWER($1) OR LOWER(title) = LOWER($1) RETURNING *";

    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json({
      message: "Hotel deleted successfully",
      deletedHotel: formatHotel(result.rows[0]),
    });
  } catch (error) {
    console.error(`Error deleting hotel ${identifier}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads served from: ${uploadDir}`);
});
