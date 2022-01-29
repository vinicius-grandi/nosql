const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
  if (JSON.stringify(req.cookies).length === 2) {
    return res.status(400).send('No token provided');
  }

  const token = JSON.parse(req.cookies.login).token;
  
  console.log(token.length)

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.send('Invalid Tokend')

    res.userId = decoded.id;

    return next();
  })
}