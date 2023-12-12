const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

const atlasUri = "mongodb+srv://zachjhavers:4ysjVLPTn0yTzmKo@realestatecluster.u96vyio.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(atlasUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB Atlas'));

const userSchema = new mongoose.Schema({
  firstName: String,
  username: { type: String, unique: true },
  password: String ,
  profilePicUrl: String,
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
});

const propertySchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number, 
  timeOnMarket: String, 
  agentName: String, 
  imageUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

const User = mongoose.model('User', userSchema);

const Property = mongoose.model('Property', propertySchema);

app.use(bodyParser.json());
app.use(express.static('./'));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: 'your secret key', 
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: atlasUri }) 
}));


app.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
      firstName: req.body.firstName,
      username: req.body.username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).send({ success: true, message: 'User created' });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (user && await bcrypt.compare(password, user.password)) {
          req.session.userId = user._id; 
          res.json({ success: true, message: 'Login successful', user });
      } else {
          res.json({ success: false, message: 'Invalid credentials' });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
      const userId = req.session.userId;
      if (!userId) {
          return res.status(400).send('User is not logged in');
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      user.profilePicUrl = '/uploads/' + req.file.filename;
      await user.save();

      res.send({ success: true, message: 'Profile picture uploaded' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.get('/user-info', async (req, res) => {
  try {
      const userId = req.session.userId;
      if (!userId) {
          console.log('No user session found');
          return res.status(400).json({ success: false, message: 'No user session found' });
      }
      const user = await User.findById(userId).populate('properties');
      if (!user) {
          console.log('User not found:', userId);
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Error in /user-info:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.post('/add-property', upload.single('propertyImage'), async (req, res) => {
  try {
    const { name, location } = req.body;
    const imageUrl = '/uploads/' + req.file.filename;
    const userId = req.session.userId;

    const property = new Property({ name, location, imageUrl, user: userId });
    await property.save();

    const user = await User.findById(userId);
    user.properties.push(property);
    await user.save();

    res.json({ success: true, message: 'Property added', property: { name, location, imageUrl } });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.get('/user-properties', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
      return res.status(401).json({ success: false, message: 'User not logged in' });
  }

  try {
      const user = await User.findById(userId).populate('properties');
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json(user.properties);
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/update-property/:propertyId', async (req, res) => {
  const { propertyId } = req.params;
  const { name, location, price, timeOnMarket, agentName } = req.body;

  try {
      const updatedProperty = await Property.findByIdAndUpdate(propertyId, {
          name,
          location,
          price,
          timeOnMarket,
          agentName
      }, { new: true }); 

      if (updatedProperty) {
          res.json({ success: true, message: 'Property updated', property: updatedProperty });
      } else {
          res.status(404).json({ success: false, message: 'Property not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          res.status(500).send('Could not log out, please try again');
      } else {
          res.send({ success: true });
      }
  });
});

app.post('/searchProperties', async (req, res) => {
  const city = req.body.city;

  try {
    const properties = await Property.find({ location: city });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
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
