const express = require('express');
const router = express.Router()
const Fawn = require('fawn')
const mongoose = require('mongoose')
const { Rental, validate } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customers');

Fawn.init(mongoose)

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

 //check if customer is valid
  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send("Invalid customer");

  //check if the movie is valid
  const movie = await Movie.findById(req.body.movieId)
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

  console.log(rental)
  //Transaction approach ensures that once an operation fails all the pther pones fail as well
  //remove one from the list of available movies
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();
    res.send(rental);

  }
  catch (error) {
    res.status(500).send('Something failed')
  }
});

// router.put('/:id', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const rental = await Rental.findByIdAndUpdate(
//     req.params.id,
//     {
//       title: req.body.title,
//       genre: req.body.genre,
//       numberInStock: req.body.numberInStock,
//       dailyRentalRate: req.body.dailyRentalRate
//     },
//     {
//       new: true
//     })
//   if (!rental) return res.status(404).send('The rental with the given ID was not found.');

//   res.send(rental);
// });

router.get('/:id', async (req, res) => {
  const rental = await Movie.findById(req.params.id)
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
});

module.exports = router; 
