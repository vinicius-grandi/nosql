var express = require('express');
const { register } = require('../app/controllers/authController');
var router = express.Router();

router.get('/', (req, res) => res.render('register', {title: 'Signup'}))
router.post('/', (req, res) => register(req, res));

module.exports = router;
