/*const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/login_mongodb', (err)=> {
    if(err) {
        console.log(err)
    }else{
        console.log('connected to db successfully!')
    }
})*/
const mongoose = require('mongoose');
const mongoDB = 'mongodb://0.0.0.0:27017/login_mongodb';

mongoose.connect(mongoDB, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore nella connessione al database:'));
db.once('open', function() {
  console.log("Connessione al database riuscita");
  
  // ...codice per eseguire operazioni sul database...
});
