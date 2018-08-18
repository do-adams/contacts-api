'use strict';

const express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to Express');
});

module.exports = router;