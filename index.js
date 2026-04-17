const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the School Management API');
});

async function initDb() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `;
    await db.execute(createTableQuery);
    console.log('Database initialized successfully: schools table is ready.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

app.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid name. It must be a non-empty string.' });
  }
  if (!address || typeof address !== 'string' || address.trim() === '') {
    return res.status(400).json({ error: 'Invalid address. It must be a non-empty string.' });
  }
  if (typeof latitude !== 'number' || isNaN(latitude)) {
    return res.status(400).json({ error: 'Invalid latitude. It must be a valid number.' });
  }
  if (typeof longitude !== 'number' || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid longitude. It must be a valid number.' });
  }


  try {
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name.trim(), address.trim(), latitude, longitude]);

    res.status(201).json({
      message: 'School added successfully',
      schoolId: result.insertId
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal Server Error while adding school' });
  }
});

app.get('/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: 'Invalid coordinates. Please provide latitude and longitude as valid numbers in the query.' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Internal Server Error while fetching schools' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initDb();
});

