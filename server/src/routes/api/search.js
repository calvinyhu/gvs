const express = require('express');
const router = express.Router();

const Gene = require('../../models/Gene/Gene');

router.post('/', (req, res) => {
  Gene.find({ Gene: req.body.gene.toUpperCase() }, req.body.desiredHeaders)
    .then(genes => {
      res.json({ genes });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
});

router.post('/suggestion', (req, res) => {
  Gene.find({ Gene: { $regex: '^' + req.body.gene.toUpperCase() } }, 'Gene', {
    sort: { Gene: 1 }
  })
    .then(suggestions => {
      res.json({ suggestions });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
});

module.exports = router;
