const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.send('No token provided');
  }
  
  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.send('Token error');
  }

  const [ scheme, token ] = parts;

  if (!/^Bearer$/.test(scheme)) {
    return res.send('Token malformed');
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.send('Invalid Tokend')

    res.userId = decoded.id;

    return next();
  })
}