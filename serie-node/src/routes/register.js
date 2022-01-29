var express = require('express');
const { register } = require('../app/controllers/authController');
var router = express.Router();

router.get('/', (req, res) =>{ 
  if (JSON.stringify(req.cookies).length > 2) {
    return res.redirect('projects');
  }
  res.render('register', {title: 'Signup'
})})
router.post('/', (req, res) => register(req, res));

module.exports = router;
