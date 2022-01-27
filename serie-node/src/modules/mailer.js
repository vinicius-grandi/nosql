const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { host, port, user, pass } = require('../config/mail.json')

var transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

transport.use('compile', hbs({
  viewEngine: {
    extname: '.html',
    partialsDir: 'C:/Users/breno/OneDrive/Documentos/Estudos/nosql/serie-node/src/resources/mail',
    defaultLayout: false,
  },
  viewPath: 'C:/Users/breno/OneDrive/Documentos/Estudos/nosql/serie-node/src/resources/mail',
  extName: '.html',
}))

module.exports = transport;
