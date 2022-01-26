const mongoClient = require('mongodb').MongoClient;

mongoClient.connect(
  'mongodb://localhost:27017', 
  {useUnifiedTopology: true}, 
  (error, connection) => {
    if(error) return console.log(error);
    console.log('Successful Connection');
    global.connection = connection.db('aula02');
});

module.exports = {}