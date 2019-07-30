const mongoose=require('mongoose')
const express = require('express');
const genres=require('./routes/genres')
const customers=require('./routes/customers')
const users=require('./routes/users')


const app = express();

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
.then(()=>console.log('Connected to MongoDB...'))
.catch((error)=>console.error('Cound not connect to MongoDB...'))

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/users', users)

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});
app.listen(port, () => console.log(`Listening on port ${port}...`));