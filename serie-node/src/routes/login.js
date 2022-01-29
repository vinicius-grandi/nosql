var express = require('express');
const { login, forgotPassword, resetPassword } = require('../app/controllers/authController');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  if (JSON.stringify(req.cookies).length === 2) {
    return res.render('login', { title: 'Login' });
  }
  return res.redirect('./projects')
});

router.get('/forgot-password', (req, res) => res.render('forgot-password', {title: 'Forgot Password'}));
router.get('/reset-password', (req, res) => {
  const email = req.query.email;
  const token = req.query.token;
  if(email && token) 
    return res.render('reset-password', {
      email: email,
      title: 'Reset Password'
    });
  res.redirect('../forgot-password');
});

router.post('/', (req, res) => login(req, res));

router.post('/forgot-password', (req, res) => forgotPassword(req, res));
router.post('/reset-password', (req, res) => {
  req.body.email = req.query.email;
  req.body.token = req.query.token;
  resetPassword(req, res)
});



module.exports = router;
