
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('pages/PetAdoption', { session: req.session });
});

app.get('/petHome', (req, res) => {
  res.render('pages/petHome');
});

app.get('/findApet', (req, res) => {
    res.render('pages/findApet');
  });
  app.post('/findApet', (req, res) => {
    const { type, gender, breed } = req.body;
    const petsFilePath = path.join(__dirname, 'availablePets.txt');
  
    try {
      let results = [];
  
      if (fs.existsSync(petsFilePath)) {
        const lines = fs.readFileSync(petsFilePath, 'utf8').trim().split('\n');
  
        results = lines.filter(line => {
          const parts = line.split(':');
          const petType = parts[2]?.toLowerCase();
          const petBreed = parts[3]?.toLowerCase();
          const petGender = parts[5]?.toLowerCase();
  
          const typeMatch = (type === 'any' || petType === type.toLowerCase());
          const genderMatch = (gender === 'any' || petGender === gender.toLowerCase());
          const breedMatch = (breed.trim() === '' || petBreed.includes(breed.toLowerCase()));
  
          return typeMatch && genderMatch && breedMatch;
        });
      }
  
      res.render('pages/findApet', { results });
    } catch (err) {
      console.error('Search Error:', err.message);
      res.status(500).send('Error searching for pets.');
    }
  });

app.get('/availablePets', (req, res) => {
  res.render('pages/availablePets');
});

// Protect petGiveAway route - only for logged-in users
app.get('/petGiveAway', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/createAccount');
  }
  res.render('pages/petGiveAway');
});

app.get('/pets', (req, res) => {
  res.render('pages/pets');
});

// troubleshooting
app.get('/test', (req, res) => {
  res.send('It works!');
});

// login and register code 
app.get('/createAccount', (req, res) => {
  res.render('pages/createAccount');
});

app.get('/login', (req, res) => {
  res.render('pages/login'); // views/pages/login.ejs
});

// POST - Handle Login Submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    const users = fs.readFileSync('users.txt', 'utf8').split('\n');
    const isValid = users.some(line => {
      const [user, pass] = line.trim().split(':');
      return user === username && pass === password;
    });

    if (isValid) {
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect('/');
    } else {
      res.send('Invalid username or password.');
    }

  } catch (err) {
    console.error('Login Error:', err.message);
    res.send('Server error while logging in.');
  }
});

// GET - Show Register Page
app.get('/register', (req, res) => {
  res.render('pages/register'); // views/pages/register.ejs
});

// POST - Handle Register Submission
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const usersFilePath = path.join(__dirname, 'users.txt');

  try {
    // Create file if it doesn't exist
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '');
    }

    const users = fs.readFileSync(usersFilePath, 'utf8').split('\n');
    const userExists = users.some(line => {
      const [user] = line.trim().split(':');
      return user === username;
    });

    if (userExists) {
      res.send('Username already taken. Please choose another.');
    } else {
      fs.appendFileSync(usersFilePath, `${username}:${password}\n`);
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect('/');
    }

  } catch (err) {
    console.error('FULL ERROR:', err.message);
    res.status(500).send('Server error while registering.');
  }
});

// Handle pet submission
const petsFilePath = path.join(__dirname, 'availablePets.txt');
app.post('/submitPet', (req, res) => {
  if (!req.session.loggedIn) {
    return res.send('You must be logged in to give away a pet.');
  }

  const { type, breed, age, gender, ...rest } = req.body;
  const username = req.session.username;

  try {
    let petId = 1;
    if (fs.existsSync(petsFilePath)) {
      const lines = fs.readFileSync(petsFilePath, 'utf8').trim().split('\n');
      petId = lines.length + 1;
    }

    const line = `${petId}:${username}:${type}:${breed}:${age}:${gender}:${Object.values(rest).join(':')}`;
    fs.appendFileSync(petsFilePath, line + '\n');

    res.send('Pet has been listed for adoption!');
  } catch (err) {
    console.error('Error writing to pet file:', err.message);
    res.status(500).send('Server error while submitting pet.');
  }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.send('Error logging out.');
      }
      res.render('pages/logout'); // Show confirmation message
    });
  });

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});