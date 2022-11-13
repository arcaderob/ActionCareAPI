// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// controllers
const login = require('./controllers/Login');

// defining the Express app
const app = express();
app.use(express.json());

// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// enabling CORS for all requests
app.use(cors());

// Testing getting the admin
app.get('/admin', (req, res) => {
    admin();
    res.send('Blah');
});

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

app.post('/login', async (req, res) => {
  const response = await login.login({username: req.body.firstname, password: req.body.password});
  res.send(response);
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});