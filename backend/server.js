const express = require("express");
const neo4j = require("neo4j-driver");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "1234";

const app = express();
app.use(express.json());
app.use(cors());

const driver = neo4j.driver(
  "neo4j://184.168.29.119:7687",
  neo4j.auth.basic("neo4j", "ooglobeneo4j")
);

const axios = require('axios');

async function geocodeLocation(country, city = '') {
  const query = city ? `${city}, ${country}` : country;

  const response = await axios.get(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        q: query,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'RemoteCareSystem/1.0'
      }
    }
  );

  if (!response.data.length) return null;

  return {
    latitude: parseFloat(response.data[0].lat),
    longitude: parseFloat(response.data[0].lon)
  };
}


const authenticateAdmin = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.sendStatus(403);
    }
    req.admin = decoded;
    next();
  });
};


/* =========================
   REGISTER REMOTE WORKER
========================= */
app.post("/worker/register", async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await session.run(
      `
      CREATE (w:RemoteWorker {
        workerID: randomUUID(),
        email: $email,
        password: $password,
        status: "unavailable",
        createdAt: datetime()
      })
      `,
      { email, password: hashedPassword }
    );

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: "Email already exists" });
  } finally {
    await session.close();
  }
});

/* =========================
   LOGIN
========================= */
app.post("/worker/login", async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (w:RemoteWorker {email: $email})
    RETURN w.workerID AS workerID, w.password AS password
    `,
    { email }
  );

  if (result.records.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const workerID = result.records[0].get("workerID");
  const hashed = result.records[0].get("password");

  const valid = await bcrypt.compare(password, hashed);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ workerID }, SECRET_KEY, { expiresIn: "2h" });

  res.json({ token, workerID });
});

/* =========================
   UPDATE BIO
========================= */
app.post("/worker/profile", async (req, res) => {
  const {
    workerID,
    firstName,
    lastName,
    spokenLanguage,
    country,
    city,
    whatsapp,
    rate                                  // ✅ NEW
  } = req.body;

  const session = driver.session();

  const location = await geocodeLocation(country, city);
  if (!location) {
    return res.status(400).json({ error: 'Unable to locate city/country' });
  }

  await session.run(
    `
    MATCH (w:RemoteWorker {workerID: $workerID})
    SET
      w.firstName = $firstName,
      w.lastName = $lastName,
      w.spokenLanguage = $spokenLanguage,
      w.country = $country,
      w.city = $city,
      w.whatsapp = $whatsapp,
      w.rate = $rate,
      w.latitude = $latitude,
      w.longitude = $longitude
    `,
    {
      workerID,
      firstName,
      lastName,
      spokenLanguage,
      country,
      city,
      whatsapp,
      rate,
      latitude: location.latitude,
      longitude: location.longitude
    }
  );

  res.json({ message: "Worker profile updated with rate and location" });
});




app.get("/worker/profile/:workerID", async (req, res) => {
  const { workerID } = req.params;
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (w:RemoteWorker {workerID: $workerID})
    RETURN w
    `,
    { workerID }
  );

  if (!result.records.length) {
    return res.status(404).json({ error: "Worker not found" });
  }

  res.json(result.records[0].get("w").properties);
});



/* =========================
   UPDATE STATUS (MANUAL)
========================= */
app.post("/worker/status", async (req, res) => {
  const { workerID, status } = req.body;
  const session = driver.session();

  await session.run(
    `
    MATCH (w:RemoteWorker {workerID: $workerID})
    SET w.status = $status
    `,
    { workerID, status }
  );

  res.json({ message: "Status updated" });
});


app.post('/patient/register', async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await session.run(
      `
      CREATE (p:Patient {
        patientID: randomUUID(),
        email: $email,
        password: $password,
        createdAt: datetime()
      })
      `,
      { email, password: hashedPassword }
    );

    res.json({ message: 'Patient registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Email already exists' });
  } finally {
    await session.close();
  }
});


app.post('/patient/login', async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (p:Patient {email: $email})
    RETURN p.patientID AS patientID, p.password AS password
    `,
    { email }
  );

  if (result.records.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const patientID = result.records[0].get('patientID');
  const hashedPassword = result.records[0].get('password');

  const valid = await bcrypt.compare(password, hashedPassword);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { patientID, role: 'patient' },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  res.json({ token, patientID });
});



app.post('/patient/profile', async (req, res) => {
  const {
    patientID,
    firstName,
    lastName,
    spokenLanguage,
    country,
    city,
    whatsapp
  } = req.body;

  if (!country || !city) {
    return res.status(400).json({ error: 'Country and city are required' });
  }

  const session = driver.session();

  const location = await geocodeLocation(country, city);
  if (!location) {
    return res.status(400).json({ error: 'Unable to locate city/country' });
  }

  await session.run(
    `
    MATCH (p:Patient {patientID: $patientID})
    SET
      p.firstName = $firstName,
      p.lastName = $lastName,
      p.spokenLanguage = $spokenLanguage,
      p.country = $country,
      p.city = $city,
      p.whatsapp = $whatsapp,
      p.latitude = $latitude,
      p.longitude = $longitude
    `,
    {
      patientID,
      firstName,
      lastName,
      spokenLanguage,
      country,
      city,
      whatsapp,
      latitude: location.latitude,
      longitude: location.longitude
    }
  );

  await session.close();

  res.json({ message: 'Patient profile updated with location' });
});





app.get('/patient/profile/:patientID', async (req, res) => {
  const { patientID } = req.params;
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (p:Patient {patientID: $patientID})
    RETURN p
    `,
    { patientID }
  );

  if (!result.records.length) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  res.json(result.records[0].get('p').properties);
});



app.post('/admin/register', async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  try {
    // 🔒 Check if an admin already exists
    const existingAdmin = await session.run(`
      MATCH (a:Admin)
      RETURN COUNT(a) AS count
    `);

    const count = existingAdmin.records[0].get('count').toNumber();

    if (count > 0) {
      return res.status(403).json({
        error: 'An admin already exists. Only one admin is allowed.'
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await session.run(
      `
      CREATE (a:Admin {
        adminID: randomUUID(),
        email: $email,
        password: $password,
        createdAt: datetime()
      })
      `,
      { email, password: hashed }
    );

    res.json({ message: 'Admin registered successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Admin registration failed' });
  } finally {
    await session.close();
  }
});



app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (a:Admin {email: $email})
    RETURN a.adminID AS adminID, a.password AS password
    `,
    { email }
  );

  if (!result.records.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const adminID = result.records[0].get('adminID');
  const hashed = result.records[0].get('password');

  const valid = await bcrypt.compare(password, hashed);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ adminID, role: 'admin' }, SECRET_KEY, {
    expiresIn: '2h'
  });

  res.json({ token, adminID });
});


app.get('/admin/patients', async (req, res) => {
  const session = driver.session();

  const result = await session.run(`
    MATCH (p:Patient)
    RETURN
      p.patientID AS patientID,
      p.firstName AS firstName,
      p.lastName AS lastName,
      p.country AS country,
      p.city AS city,
      p.spokenLanguage AS spokenLanguage
  `);

  await session.close();

  res.json(result.records.map(r => r.toObject()));
});


app.get('/admin/workers', async (req, res) => {
  const { language } = req.query;
  const session = driver.session();

  const query = `
    MATCH (w:RemoteWorker)
    WHERE w.latitude IS NOT NULL
      AND w.longitude IS NOT NULL
      ${language ? 'AND toLower(w.spokenLanguage) CONTAINS toLower($language)' : ''}
    RETURN
      w.workerID AS workerID,
      w.firstName AS firstName,
      w.lastName AS lastName,
      w.country AS country,
      w.city AS city,
      w.spokenLanguage AS spokenLanguage,
      w.status AS status,
      w.whatsapp AS whatsapp,
      w.rate AS rate,
      w.latitude AS latitude,
      w.longitude AS longitude
  `;

  const result = await session.run(query, { language });
  await session.close();

  res.json(result.records.map(r => r.toObject()));
});


app.get('/admin/patients-map', async (req, res) => {
  const session = driver.session();

  const result = await session.run(`
    MATCH (p:Patient)
    WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
    RETURN
      p.patientID AS patientID,
      p.firstName AS firstName,
      p.lastName AS lastName,
      p.country AS country,
      p.city AS city,
      p.whatsapp AS whatsapp,
      p.spokenLanguage AS spokenLanguage,
      p.latitude AS latitude,
      p.longitude AS longitude
  `);

  await session.close();
  res.json(result.records.map(r => r.toObject()));
});




app.get('/admin/worker/:workerID', async (req, res) => {
  const { workerID } = req.params;
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (w:RemoteWorker {workerID: $workerID})
    RETURN w
    `,
    { workerID }
  );

  await session.close();

  if (!result.records.length) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  res.json(result.records[0].get('w').properties);
});

app.delete('/admin/patient/:patientID', authenticateAdmin, async (req, res) => {
  const { patientID } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Patient {patientID: $patientID})
      DETACH DELETE p
      RETURN COUNT(p) AS deleted
      `,
      { patientID }
    );

    const deleted = result.records[0].get('deleted').toNumber();

    if (deleted === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });

  } finally {
    await session.close();
  }
});


app.delete('/admin/worker/:workerID', authenticateAdmin, async (req, res) => {
  const { workerID } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (w:RemoteWorker {workerID: $workerID})
      DETACH DELETE w
      RETURN COUNT(w) AS deleted
      `,
      { workerID }
    );

    const deleted = result.records[0].get('deleted').toNumber();

    if (deleted === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json({ message: 'Worker deleted successfully' });

  } finally {
    await session.close();
  }
});





app.listen(5003, () => console.log("Backend running on port 5003"));


 


