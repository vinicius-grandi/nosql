const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json')

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, { expiresIn: 86400});
  
  return token;
}

const register = async (req, res) => {
  const { email } = req.body;

  try {
    if(await User.findOne({ email })) {
      return res.status(400).send('User already exists'); 
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.redirect('/');
  } catch(err) {
    return res.status(400).send({ error: 'Registration failed'});
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if(!user) {
    return res.send('Invalid email/password');
  }

  if(!await bcrypt.compare(password, user.password)) {
    return res.send('Invalid email/password');
  }

  user.password = undefined;

  res.send({ user, token: generateToken({ id: user.id }) });
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();

    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });

    mailer.sendMail({
      to: email,
      from: 'christecustie@gmail.com',
      template: 'auth/forgot_password',
      context: { token, email },
    }, (err) => {
      if (err) {
        return res.send('Cannot send forgot password email')
      };

      return res.send('Check your email.');
    })
  } catch (err) {
    res.status(400).send({ error: 'Error on forgot password' });
  }
}

const resetPassword = async (req, res) => {

}

module.exports = { register, login, forgotPassword, resetPassword };
