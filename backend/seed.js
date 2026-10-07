const pool = require("./db");

const seedHotels = [
  {
    title: "Hotel Grande",
    price: 2500,
    description: "Comfortable rooms with excellent facilities.",
    image: "grandhotel.jpg",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    title: "Royal Hotel",
    price: 3000,
    description: "Relax in spacious rooms with modern amenities.",
    image: "royalhotel.jpg",
    latitude: 13.0674,
    longitude: 80.2376,
  },
  {
    title: "Emerald Suits",
    price: 3000,
    description: "Modern suits designed for a comfortable and memorable stay.",
    image: "emeraldsuits.jpg",
    latitude: 13.0475,
    longitude: 80.209,
  },
  {
    title: "Sunset Vista",
    price: 1500,
    description: "Beautiful rooms with a relaxing view and warm hospitality.",
    image: "sunsetvista.jpg",
    latitude: 13.0604,
    longitude: 80.2496,
  },
  {
    title: "Lakeside Retreat",
    price: 1000,
    description: "Enjoy a peaceful lakeside stay with beautiful views and comfortable rooms.",
    image: "lakeside.jpg",
    latitude: 13.082,
    longitude: 80.275,
  },
  {
    title: "Moonlight Residency",
    price: 1200,
    description: "A dreamy stay under the glow of the moon.",
    image: "moonlight.jpg",
    latitude: 11.0168,
    longitude: 76.9558,
  },
  {
    title: "The Fern Residency",
    price: 2800,
    description: "A modern stay offering elegant rooms, relaxing interiors and convenient facilities.",
    image: "feran.jpg",
    latitude: 11.0168,
    longitude: 76.9558,
  },
  {
    title: "Silver Oak Resort",
    price: 3200,
    description: "A peaceful resort surrounded by refreshing scenery, comfortable rooms and relaxing spaces.",
    image: "silver oak.jpg",
    latitude: 11.4102,
    longitude: 76.695,
  },
  {
    title: "Golden Crown",
    price: 3500,
    description: "A stylish city hotel with spacious rooms, modern amenities and convenient access.",
    image: "golden crown.jpg",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    title: "Blue Horizon",
    price: 3000,
    description: "A comfortable luxury stay featuring elegant interiors, excellent dining and relaxing atmosphere.",
    image: "blue horizon.jpg",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    title: "Heritage Palace",
    price: 4500,
    description: "An elegant heritage-inspired hotel combining traditional charm with luxurious rooms.",
    image: "Heritage Palace.jpg",
    latitude: 9.9252,
    longitude: 78.1198,
  },
  {
    title: "Crystal Bay Hotel",
    price: 3300,
    description: "A stylish coastal hotel offering comfortable accommodation and relaxing surroundings.",
    image: "Crystal Bay Hotel.jpg",
    latitude: 11.9416,
    longitude: 79.8083,
  },
];

async function seed() {
  try {
    const existing = await pool.query("SELECT COUNT(*) FROM hotels");
    console.log(`Current hotel count: ${existing.rows[0].count}`);

    if (parseInt(existing.rows[0].count, 10) === 0) {
      console.log("Seeding hotels table...");
      for (const hotel of seedHotels) {
        await pool.query(
          `INSERT INTO hotels (title, description, latitude, longitude, price, image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [hotel.title, hotel.description, hotel.latitude, hotel.longitude, hotel.price, hotel.image]
        );
      }
      console.log(`✅ Seeded ${seedHotels.length} hotels successfully.`);
    } else {
      console.log("Hotels table already has data. Skipping seed.");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await pool.end();
  }
}

seed();
