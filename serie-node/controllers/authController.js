const User = require('../models/User');

const authController = async (req, res) => {
  try {
    await User.create(req.body);

    return res.redirect('/')
  } catch(err) {
    return res.status(400).send({ error: 'Registration failed'})
  }
}

module.exports = authController
