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
    origin: "https://curacompanion.vercel.app", // <-- your frontend URL
    credentials: true
}));

// CORRECT PATH: backend → ../ → frontend
let initialPath = path.join(__dirname, "..", "frontend");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  

app.use(express.static(path.join(__dirname, "..", "..")));
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


app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        const user = await db("users")
            .select("name", "email", "password")
            .where({ email })
            .first();

        // ❌ User not found (not signed up)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account does not exist. Please sign up."
            });
        }

        // ❌ Wrong password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // ✅ Login successful
        return res.json({
            success: true,
            message: "Login successful",
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ---------- START SERVER ----------

app.listen(3000, () => {
    console.log('listening on port 3000...');
});
