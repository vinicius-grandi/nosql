var express = require('express');
const authController = require('../controllers/authController');
var router = express.Router();

router.get('/', (req, res) => res.render('register', {title: 'Signup'}))
router.post('/', (req, res) => authController(req, res));

module.exports = router;
