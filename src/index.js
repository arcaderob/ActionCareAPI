// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { createTask, deleteTask, fetchTasks } = require('../src/controllers/Tasks');

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

app.post('/task', async (req, res) => {
  const result = await createTask(req.body);
  res.send({result});
});

app.get('/tasks', async (req, res) => {
  const results = await fetchTasks(req.query.email)
  res.send(results);
});

app.post('/deleteTask', async (req, res) => {
  const result = await deleteTask(req.body);
  res.send(result);
});

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send('404');
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});