const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const connectDB = require("./config/db");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Connect to DB
connectDB();

// Routes
const buyersRouter = require('./routes/buyers');
app.use('/buyers', buyersRouter);

const sellersRouter = require('./routes/sellers');
app.use('/sellers', sellersRouter);

const propertyRouter = require('./routes/properties');
app.use('/properties', propertyRouter);

const favouritesRouter = require('./routes/favourites');
app.use('/favourites', favouritesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (error, promise) => {
    console.log(`Logged Error: ${error}`);
    server.close(() => process.exit(1));
  });