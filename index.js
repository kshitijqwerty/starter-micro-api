
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));



const users = [
  { username: 'user1', password: 'pass1' }, // password is "password1"
  { username: 'user2', password: 'pass2' }, // password is "password2"
];

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { message: req.session.message });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    req.session.message = 'Invalid username or password';
    res.redirect('/login');
  } else if (password.localeCompare(user.password) != 0) {
    req.session.message = 'Invalid username or password';
    res.redirect('/login');
  } else {
    req.session.user = user;
    res.redirect('/dashboard');
  }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      res.render('dashboard', { user: req.session.user });
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });

// http.createServer(function (req, res) {
//     console.log(`Just got a request at ${req.url}!`)
//     res.write('Yo!');
//     res.end();
// }).listen(process.env.PORT || 3000);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000');
  });