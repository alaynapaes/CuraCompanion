require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors'); 

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'kamya',
        password: '',
        database: 'loginformytvideo'
    }
});

const app = express();

// Enable CORS for your Vercel frontend
app.use(cors({
    origin: "https://cura-campanion.vercel.app", // <-- your frontend URL
    credentials: true
}));

// CORRECT PATH: backend → ../ → frontend
let initialPath = path.join(__dirname, "..", "frontend");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.static(initialPath));

// ---------- FRONTEND ROUTES ----------
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "home.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(initialPath, "signup.html"));
});

// ---------- BACKEND API ROUTES ----------

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.type("text").send("Please fill all the fields");
    }

    db("users")
      .insert({ name, email, password })
      .then(() => {
        res.json({ name, email });
      })
      .catch(err => {
        if (err.detail && err.detail.includes("already exists")) {
            return res.json({ error: "Email already exists" });
        } else {
            return res.json({ error: "Signup failed" });
        }
    });
});


app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
      .from('users')
      .where({
          email: email,
          password: password
      })
     .then(data => {
    if (data.length) {
        // ✅ SUCCESS
        res.json(data[0]);
    } else {
        // ❌ ERROR
        res.json({ error: "Email or password is incorrect" });
      }
    });
  });

// ---------- START SERVER ----------

app.listen(3000, () => {
    console.log('listening on port 3000...');
});
