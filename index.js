const mongoose=require('mongoose')
const express = require('express');
const genres=require('./routes/genres')
const customers=require('./routes/customers')
const users=require('./routes/users')
const movies=require('./routes/movies')
const rentals=require('./routes/rentals')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
.then(()=>console.log('Connected to MongoDB...'))
.catch((error)=>console.error('Cound not connect to MongoDB...'))

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/users', users)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));