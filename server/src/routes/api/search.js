const express = require('express');
const router = express.Router();

const Gene = require('../../models/Gene/Gene');

// POST /
// Retrieve gene data from given gene name
router.post('/', (req, res) => {
  Gene.find({ Gene: req.body.gene.toUpperCase() }, req.body.desiredHeaders)
    .then(genes => {
      res.json({ genes });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
});

// POST /suggestion
// Retrieve auto-complete suggestions from given gene name
router.post('/suggestion', (req, res) => {
  Gene.find({ Gene: { $regex: '^' + req.body.gene.toUpperCase() } }, 'Gene', {
    sort: { Gene: 1 }
  })
    .then(suggestions => {
      res.json({ suggestions, gene: req.body.gene });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
});

module.exports = router;
