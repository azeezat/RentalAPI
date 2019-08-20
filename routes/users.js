const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {User,validate} = require('../models/user');

router.get('/', async (req, res) => {
  const user = await User.find().sort('name');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user =await User.findOne({email:req.body.email})
  if(user) return res.status(400).send('User already registered.')

  //Hash password
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(req.body.password, salt)

  user = new User({ 
      name: req.body.name,
      email:req.body.email,
      password: hashed
  });
  await user.save();

  res.send({
    name: user.name,
    email: user.email,
    _id: user.id
  });
});

module.exports = router;