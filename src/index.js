// importing the dependencies
// ./src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { createTask, deleteTask, fetchTasks, fetchSubTasks } = require('../src/controllers/Tasks');
const { startCronJob } = require('../src/controllers/CronJob');
const { createSubscriber, fetchSubscribers, deleteSubscriber } = require('../src/controllers/Subscribers');

// defining the Express app
const app = express();
app.use(express.json());

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
  const results = await fetchTasks(req.query.email);
  res.send(results);
});

app.get('/subTasks', async (req, res) => {
  const results = await fetchSubTasks(req.query.email);
  res.send(results);
});

app.post('/deleteTask', async (req, res) => {
  const result = await deleteTask(req.body);
  res.send(result);
});

app.post('/subscriber', async (req, res) => {
  const result = await createSubscriber(req.body);
  res.send(result);
});

app.get('/subscribers', async (req, res) => {
  const results = await fetchSubscribers(req.query.email);
  res.send(results);
});

app.post('/deleteSubscriber', async (req, res) => {
  const results = await deleteSubscriber(req.body);
  res.send(results);
});

app.get('/', (req, res) => {
  res.send('404');
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});

startCronJob();