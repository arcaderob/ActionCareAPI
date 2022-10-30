// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./Aculert', (err) => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the in-memory SQlite database.');
});

const admin = () => {
    db.serialize(() => {
        db.each("SELECT * FROM `Users`", (err, row) => {
            if (err) {
                console.log('ERROR SELECTING DATA');
                console.log(err);
                return;
            }
    
            console.log(row.ID);
        });
    });
};

const closeDb = () => db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// Testing getting the admin
app.get('/admin', (req, res) => {
    admin();
    res.send('Blah');
});

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});