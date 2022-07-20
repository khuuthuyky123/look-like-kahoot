var express = require('express');
var http = require('http');
var cors = require('cors')
var cookieParser = require('cookie-parser');
require('dotenv').config({path:'./config/dev.env'});
require('./utils/db');

var app = express();
app.use(cors());

const authRouter = require('./routes/auth.route.js');
const quizRouter = require("./routes/quiz.route.js");
const auth = require('./middlewares/auth.mdw.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/quiz',auth, quizRouter);
app.use('/',auth, function(req,res,next) {
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