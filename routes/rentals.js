const express = require('express');
const router = express.Router()
const { Rental, validate } = require('../models/rentals');
const { Genre } = require('../models/genres');

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if cutomer is valid
  const customer = await Genre.findById(req.body.customerId)
  if (!customer) return res.status(400).send("Invalid customer");

  //check if the movie is valid
  const movie = await Genre.findById(req.body.movieId)
  if (!movie) return res.status(400).send("Invalid movie");

  //check if movie exists
  if (movie.numberInStock === 0) return res.status(400).send('Movie not available')

  let rental = new Movie({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  rental = await rental.save();
  
  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    {
      new: true
    })
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

router.delete('/:id', async (req, res) => {
  const rental = await Movie.findByIdAndRemove(req.params.id)
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
});

router.get('/:id', async (req, res) => {
  const rental = await Movie.findById(req.params.id)
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
});

module.exports = router; 
