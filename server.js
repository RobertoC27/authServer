//Main entry point

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');


var corsOptions = {
    origin: 'localhost:3000',
    opstionsSuccessStatus: 200
}
//DB
var config = {
  "USER"    : "DBUser",           
  "PASS"    : "DBPassword",
  "HOST"    : "ipAddress or dns",  
  "PORT"    : "27017", 
  "DATABASE" : "DBName"
};
try {
  
  mongoose.connect(`mongodb://${config.USER}:${config.PASS}@${config.HOST}:${config.port}/${config.DATABASE}`, {useNewUrlParser: true});
} catch (error) {
  console.log(error);
  
}
// mongoose.connect('mongodb://easyadmin:easyadmin1@ds139934.mlab.com:39934/easy-files', {useNewUrlParser: true});
//APP
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors());
router(app);

//Server
const port = process.env.PORT || 3090;

const server = http.createServer(app);

server.listen(port)
console.log('Server is listening on: ', port);
