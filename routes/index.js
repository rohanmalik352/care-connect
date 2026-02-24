const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'CareConnect - Unified Patient Records & Doctor Collaboration', user: req.user });
});

module.exports = router;