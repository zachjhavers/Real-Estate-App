const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

// Connecting To Mongo DB
mongoose.connect('mongodb://localhost:27017/RealEstateApp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  username: { type: String, unique: true },
  password: String 
});

// User Model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('./'));

// POST route for registration
app.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user instance and save it to the database
    const newUser = new User({
      firstName: req.body.firstName,
      username: req.body.username,
      password: hashedPassword
    });

    await newUser.save();

    // Redirect to home page or send a success message
    res.status(201).send({ success: true, message: 'User created' });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username, password });
      if (user) {
          res.json({ success: true, message: 'Login successful' });
      } else {
          res.json({ success: false, message: 'Invalid credentials' });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
