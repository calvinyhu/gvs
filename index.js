const express = require('express');
const path = require('path');
require('dotenv').config();

// App Setup
const app = require('./app');

// Deployment Setup
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  // Serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Server Setup
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
