const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

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
        return res.send("Please fill all the fields");
    }

    db("users")
        .insert({ name, email, password })
        .then(() => {
            res.send("Signup successful");
        })
        .catch(err => {
            if (err.detail && err.detail.includes('already exists')) {
                res.send("Email already exists");
            } else {
                res.send("Error inserting user");
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
              res.json(data[0]);
          } else {
              res.json('email or password is incorrect');
          }
      });
});

// ---------- START SERVER ----------

app.listen(3000, () => {
    console.log('listening on port 3000...');
});
