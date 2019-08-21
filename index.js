const mongoose = require('mongoose')
const express = require('express');
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const users = require('./routes/users')
const auth = require('./routes/auth')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const config = require('config')
const { JWT_PRIVATE_KEY } = require('./constants/constants')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();

//set environment variables
if (!config.get(JWT_PRIVATE_KEY)) {
    console.error('FATAL ERROR: jwtPrivatekey is not defined')
    //exit the process
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((error) => console.error('Cound not connect to MongoDB...'))

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/users', users)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/auth', auth)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));