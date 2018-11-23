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
  const gene = req.body.gene.toUpperCase();
  Gene.distinct('Gene', { Gene: new RegExp('^' + gene) }, (error, uniques) => {
    if (error) res.status(400).json({ error });
    res.json({ suggestions: uniques, gene: req.body.gene });
  });
});

module.exports = router;
