const express = require('express');
const router = express.Router();

const Gene = require('../../models/Gene/Gene');

router.post('/', (req, res) => {
  Gene.find({ Gene: req.body.gene })
    .then(genes => {
      res.json({ genes });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
});

module.exports = router;
