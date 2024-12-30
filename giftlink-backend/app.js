/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// Route files
const authRoutes = require('./routes/AuthRoutes');
// Gift API Task 1: Import the giftRoutes and store in a constant called giftroutes
const giftroutes = require('./routes/gifts'); // Assuming the routes are in a "routes/gifts.js" file

// Search API Task 1: Import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/search'); // Assuming the routes are in a "routes/search.js" file

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/auth', authRoutes);

// Gift API Task 2: Add the giftRoutes to the server by using the app.use() method.
app.use('/gifts', giftroutes); // Mount the gift routes under the "/gifts" path

// Search API Task 2: Add the searchRoutes to the server by using the app.use() method.
app.use('/search', searchRoutes); // Mount the search routes under the "/search" path

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
