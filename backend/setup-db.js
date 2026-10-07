const pool = require("./db");

const initialHotels = [
  {
    name: "Hotel Grande",
    price: 2500,
    description: "Comfortable rooms with excellent facilities.",
    image: "grandhotel.jpg",
    latitude: 13.0827,
    longitude: 80.2707,
    rating: 4.5,
    location: "chennai,Tamil Nadu",
    roomType: "Deluxe Room",
    offer: 20,
    suitableFor: ["Luxury", "Relaxing", "Family"],
    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Restaurant",
      "Free Parking",
      "Room Service"
    ],
    roomImages: [
      "/hotelgranderoom1.jpg",
      "/grandehote living.jpg",
      "/hotelgrande dining.jpg",
      "/grande bathroom.jpg"
    ]
  },
  {
    name: "Royal Hotel",
    price: 3000,
    description: "Relax in spacious rooms with modern amenities.",
    image: "royalhotel.jpg",
    latitude: 13.0674,
    longitude: 80.2376,
    rating: 4.3,
    location: "coimbtore,Tamil Nadu",
    roomType: "Executive Room",
    offer: 15,
    suitableFor: ["Luxury", "Business", "City"],
    amenities: [
      "Free Wi-Fi",
      "Spa",
      "Fitness Center",
      "Conference Room",
      "Breakfast Included"
    ],
    roomImages: [
      "/royalroom1.jpg",
      "/royalhotel living.jpg",
      "/royal dining.jpg",
      "/royal bathroom.jpg"
    ]
  },
  {
    name: "Emerald Suits",
    price: 3000,
    description: "Modern suits designed for a comfotable and memorable stay.",
    image: "emeraldsuits.jpg",
    latitude: 13.0475,
    longitude: 80.2090,
    rating: 4.7,
    location: "chennai,Tamil Nadu",
    roomType: "Premium Room",
    offer: 20,
    suitableFor: ["Relaxing", "Family", "Luxury"],
    amenities: [
      "Rooftop Restaurant",
      "Airport Pickup",
      "24/7 Front Desk",
      "Laundry Service",
      "Air Conditioning"
    ],
    roomImages: [
      "/emeralad room.jpg",
      "/emerald living.jpg",
      "/emerald dining.jpg",
      "/emerald bathroom.jpg"
    ]
  },
  {
    name: "Sunset Vista",
    price: 1500,
    description: "Beautiful rooms with a relaxing view and warm hospitality.",
    image: "sunsetvista.jpg",
    latitude: 13.0604,
    longitude: 80.2496,
    rating: 4.2,
    location: "salem,Tamil Nadu",
    roomType: "Family Suite",
    offer: 25,
    suitableFor: ["Relaxing", "Nature", "Luxury"],
    amenities: [
      "Kids Play Area",
      "Family Restaurant",
      "Garden",
      "Free Parking",
      "Breakfast Included"
    ],
    roomImages: [
      "/sunsetvistaroom1.jpg",
      "/sunsetvistaliving.jpg",
      "/sunset dining.jpg",
      "/sunsetvista bathroom.jpg"
    ]
  },
  {
    name: "Lakeside Retreat",
    price: 1000,
    description: "Enjoy a peaceful lakeside stay with beautiful views and comfortable rooms.",
    image: "lakeside.jpg",
    latitude: 13.0820,
    longitude: 80.2750,
    rating: 4.8,
    location: "Munnar,Kerala",
    roomType: "Luxury Suite",
    offer: 15,
    suitableFor: ["Nature", "Family", "Relaxing"],
    amenities: [
      "Infinity Pool",
      "Luxury Spa",
      "Bar & Lounge",
      "Valet Parking",
      "Smart TV"
    ],
    roomImages: [
      "/lakeside room.jpg",
      "/lakeside living.jpg",
      "/lakeside dining.jpg",
      "/lakeside bathroom.jpg"
    ]
  },
  {
    name: "Moonlight Residency",
    price: 1200,
    description: "A dreamy stay under the glow of the moon.",
    image: "moonlight.jpg",
    latitude: 11.0168,
    longitude: 76.9558,
    rating: 4.9,
    location: "Kochin,Kerala",
    roomType: "Presidential Suite",
    offer: 10,
    suitableFor: ["Family", "Business", "City"],
    amenities: [
      "Private Balcony",
      "Butler Service",
      "Jacuzzi",
      "Fine Dining",
      "24/7 Room Service"
    ],
    roomImages: [
      "/moonlightroom1.jpg",
      "/moonlightlivingarea.jpg",
      "/moonlight dining.jpg",
      "/moonlight bathroom.jpg"
    ]
  },
  {
    name: "The Fern Residency",
    price: 2800,
    description: "A modern stay offering elegant rooms, relaxing interiors and convenient facilities for both business and leisure travelers.",
    image: "feran.jpg",
    latitude: 11.0168,
    longitude: 76.9558,
    rating: 4.7,
    location: "Coimbatore, Tamil Nadu",
    roomType: "Premium Room",
    offer: 20,
    suitableFor: ["Business", "Family", "City"],
    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Restaurant",
      "Fitness Center",
      "Free Parking"
    ],
    roomImages: [
      "/feran.jpg"
    ]
  },
  {
    name: "Silver Oak Resort",
    price: 3200,
    description: "A peaceful resort surrounded by refreshing scenery, comfortable rooms and relaxing spaces for a memorable getaway.",
    image: "silver oak.jpg",
    latitude: 11.4102,
    longitude: 76.6950,
    rating: 4.6,
    location: "Ooty, Tamil Nadu",
    roomType: "Family Suite",
    offer: 30,
    suitableFor: ["Nature", "Family", "Relaxing"],
    amenities: [
      "Garden",
      "Campfire Area",
      "Restaurant",
      "Free Parking",
      "Room Service"
    ],
    roomImages: [
      "/silver oak.jpg"
    ]
  },
  {
    name: "Golden Crown",
    price: 3500,
    description: "A stylish city hotel with spacious rooms, modern amenities and convenient access to business and entertainment areas.",
    image: "golden crown.jpg",
    latitude: 12.9716,
    longitude: 77.5946,
    rating: 4.8,
    location: "Bangalore, Karnataka",
    roomType: "Executive Room",
    offer: 25,
    suitableFor: ["Business", "Luxury", "City"],
    amenities: [
      "Free Wi-Fi",
      "Business Center",
      "Fitness Center",
      "Conference Room",
      "Breakfast Included"
    ],
    roomImages: [
      "/golden crown.jpg"
    ]
  },
  {
    name: "Blue Horizon",
    price: 3000,
    description: "A comfortable luxury stay featuring elegant interiors, excellent dining and a relaxing atmosphere for travelers.",
    image: "blue horizon.jpg",
    latitude: 13.0827,
    longitude: 80.2707,
    rating: 4.5,
    location: "Chennai, Tamil Nadu",
    roomType: "Luxury Suite",
    offer: 10,
    suitableFor: ["Luxury", "Relaxing", "City"],
    amenities: [
      "Rooftop Restaurant",
      "Spa",
      "Swimming Pool",
      "Airport Pickup",
      "24/7 Front Desk"
    ],
    roomImages: [
      "/blue horizon.jpg"
    ]
  },
  {
    name: "Heritage Palace",
    price: 4500,
    description: "An elegant heritage-inspired hotel combining traditional charm with luxurious rooms and premium hospitality.",
    image: "Heritage Palace.jpg",
    latitude: 9.9252,
    longitude: 78.1198,
    rating: 4.9,
    location: "Madurai, Tamil Nadu",
    roomType: "Presidential Suite",
    offer: 30,
    suitableFor: ["Luxury", "Family", "Relaxing"],
    amenities: [
      "Fine Dining",
      "Private Balcony",
      "Jacuzzi",
      "Butler Service",
      "24/7 Room Service"
    ],
    roomImages: [
      "/Heritage Palace.jpg"
    ]
  },
  {
    name: "Crystal Bay Hotel",
    price: 3300,
    description: "A stylish coastal hotel offering comfortable accommodation, relaxing surroundings and convenient facilities for guests.",
    image: "Crystal Bay Hotel.jpg",
    latitude: 11.9416,
    longitude: 79.8083,
    rating: 4.6,
    location: "Pondicherry",
    roomType: "Deluxe Room",
    offer: 20,
    suitableFor: ["Relaxing", "Nature", "Luxury"],
    amenities: [
      "Beach Access",
      "Free Wi-Fi",
      "Restaurant",
      "Outdoor Pool",
      "Laundry Service"
    ],
    roomImages: [
      "/Crystal Bay Hotel.jpg"
    ]
  }
];

async function setup() {
  try {
    console.log("Setting up hotels table in PostgreSQL...");

  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        price NUMERIC NOT NULL DEFAULT 0,
        description TEXT,
        image VARCHAR(500),
        latitude NUMERIC,
        longitude NUMERIC,
        rating NUMERIC DEFAULT 4.0,
        location VARCHAR(255),
        room_type VARCHAR(255),
        offer NUMERIC DEFAULT 0,
        suitable_for JSONB DEFAULT '[]'::jsonb,
        amenities JSONB DEFAULT '[]'::jsonb,
        room_images JSONB DEFAULT '[]'::jsonb
      );
    `);

   
    const alterQueries = [
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS title VARCHAR(255);`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.0;`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS location VARCHAR(255);`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS room_type VARCHAR(255);`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS offer NUMERIC DEFAULT 0;`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS suitable_for JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE hotels ADD COLUMN IF NOT EXISTS room_images JSONB DEFAULT '[]'::jsonb;`
    ];

    for (const q of alterQueries) {
      await pool.query(q);
    }

   
    await pool.query("TRUNCATE TABLE hotels RESTART IDENTITY;");

    for (const h of initialHotels) {
      await pool.query(
        `INSERT INTO hotels (
          name, title, price, description, image, latitude, longitude,
          rating, location, room_type, offer, suitable_for, amenities, room_images
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )`,
        [
          h.name,
          h.name,
          h.price,
          h.description,
          h.image,
          h.latitude,
          h.longitude,
          h.rating,
          h.location,
          h.roomType,
          h.offer,
          JSON.stringify(h.suitableFor || []),
          JSON.stringify(h.amenities || []),
          JSON.stringify(h.roomImages || [])
        ]
      );
    }

    const count = await pool.query("SELECT COUNT(*) FROM hotels;");
    console.log(`✅ Success! Seeded ${count.rows[0].count} complete hotels into PostgreSQL database.`);
  } catch (error) {
    console.error("Setup error:", error);
  } finally {
    await pool.end();
  }
}

setup();
