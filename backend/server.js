const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/userModel'); // Import the User model

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files (HTML, JS)

const cors = require('cors');
app.use(cors());

// Connect to the database using the provided MongoDB URI
const mongoUri = process.env.MONGO_URI || "mongodb+srv://james:0827James@mernapp.zomz5.mongodb.net/web?retryWrites=true&w=majority&appName=MERNapp";
const port = process.env.PORT || 4000; // Port is set to 5000 here, can be adjusted based on your needs

// If the MongoDB URI is not set, terminate the application
if (!mongoUri) {
    console.error('MONGO_URI is not defined in the .env file.');
    process.exit(1);
}

// Connect to MongoDB
mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
    });

// Routes for registration and login
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

