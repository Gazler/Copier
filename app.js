
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var users = [];
var user_names = [];

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.on('register_user', function(data) {
    if (user_names.indexOf(data) == -1)
    {
        users.push({'user': data, 'socket': socket});
        user_names.push(data);
        socket.broadcast.emit('get_users', user_names);
    }
    else
    {
        user_names[user_names.indexOf(data)].socket = socket;
    }
    socket.emit('get_users', user_names);
  });
  
  socket.on('send_pastie', function(data) {
    for (var i = 0; i <users.length; i++) {
        console.log(data.user == users[i].user);
        if (data.user == users[i].user)
        {
            users[i].socket.emit('pastie', {message: "You have been sent a pastie ", pastie: data.pastie});
        }
    }
  });
});

