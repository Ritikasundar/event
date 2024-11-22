// server.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/eventsDB')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define Event schema and model
const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    location: String,
    description: String
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route to add a new event
app.post('/add-events', async (req, res) => {
    const { name, date, location, description } = req.body;

    try {
        const newEvent = new Event({
            name,
            date,
            location,
            description
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event added successfully!' });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Failed to add event' });
    }
});

// GET route to fetch all events
app.get('/get-events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
