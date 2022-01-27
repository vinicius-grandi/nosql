var express = require('express');
const { login, forgotPassword, resetPassword } = require('../app/controllers/authController');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => res.render('login'));
router.get('/forgot-password', (req, res) => res.render('forgot-password'));
router.get('/reset-password', (req, res) => {
  if(req.query.token) 
    return res.render('reset-password', {token: req.query.token})
  res.redirect('../forgot-password');
});

router.post('/', (req, res) => login(req, res));
router.post('/forgot-password', (req, res) => forgotPassword(req, res))

module.exports = router;
