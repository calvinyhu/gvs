const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const search = require('./routes/api/search');

// Database Setup
mongoose
  .connect(
    process.env.PROD_MONGODB ||
      'mongodb://calvinyhu:calvinyhu1@ds249737.mlab.com:49737/gvs',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB connected.');
  })
  .catch(error => {
    console.log(error);
  });

// App Setup
const app = express();

// App Middleware Setup
// CORS
// TODO: Create white list of allowed origins
// See https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// App Routes Setup
app.use('/api/search', search);

module.exports = app;
