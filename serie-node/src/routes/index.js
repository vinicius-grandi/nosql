var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (JSON.stringify(req.cookies).length > 2) {
    return res.render('index', { title: 'Home', login: true});
  }
  res.render('index', { title: 'Express', login: false});
});

router.get('/logout', (req, res) => {
  res.clearCookie('login');
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
