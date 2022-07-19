var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
require('dotenv').config({path:'./config/dev.env'});

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', function(req,res,next) {
    res.send("Hello");
})


var server = http.createServer(app);
const host = 'localhost';
const port = process.env.PORT;

const { Server } = require("socket.io");
const io = new Server(server);
require('./socket.js').init(server);

server.listen(port,host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});