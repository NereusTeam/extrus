var blogController = require('../blogs/blogController.js');
var userController = require('../users/userController.js');
var messageController = require('../messages/messageController.js')
var helpers = require('./helpers.js');


////////////////////

////////////////////
// exporting DB controller's functions
module.exports = function(app, express){


	app.get('/', function(req, res) {
  //send the index.html in our public directory
  res.sendfile('index.html');
});

//This route is simply run only on first launch just to generate some chat history
app.post('/setup', function(req, res) {
  //Array of chat data. Each object properties must match the schema object properties
  var chatData = [{
    created: new Date(),
    content: 'Hi',
    username: 'Chris',
    room: 'php'
  }, {
    created: new Date(),
    content: 'Hello',
    username: 'Obinna',
    room: 'laravel'
  }, {
    created: new Date(),
    content: 'Ait',
    username: 'Bill',
    room: 'angular'
  }, {
    created: new Date(),
    content: 'Amazing room',
    username: 'Patience',
    room: 'socet.io'
  }];

  //Loop through each of the chat data and insert into the database
  for (var c = 0; c < chatData.length; c++) {
    //Create an instance of the chat model
    var newChat = new Chat(chatData[c]);
    //Call save to insert the chat
    newChat.save(function(err, savedChat) {
      console.log(savedChat);
    });
  }
  //Send a resoponse so the serve would not get stuck
  res.send('created');
});

//This route produces a list of chat as filterd by 'room' query
app.get('/msg', function(req, res) {
  //Find
  Chat.find({
    'room': req.query.room.toLowerCase()
  }).exec(function(err, msgs) {
    //Send
    res.json(msgs);
  });
});









	app.post('/api/users/signin', userController.signin);
	app.get('/api/users/signedin', userController.checkAuth);
	app.get('/api/users', userController.getAllUsers);
	app.post('/api/users', userController.newUser);
	app.post('/api/users/forget', userController.forgetPassUser);
	app.post('/api/users/editProfile',helpers.decode, userController.editProfile);
	app.get('/api/users/:id',helpers.decode, userController.getOne);

	//Delete User
	app.post('/api/users/delete', userController.deleteUser);


	// Pair Reflect Post
	app.post('/api/users/pairReflect',helpers.decode,userController.pairReflectCalculator);


	// Two Posts for getting the messages and sending the message
	app.post('/api/users/sendMessage',helpers.decode, messageController.sendMessage);
	app.post('/api/users/getMessages',helpers.decode, messageController.getMessage);
	app.post('/api/users/getUserMessagedFriends',helpers.decode, messageController.getUserMessagedFriends);

	// app.get('/api/users/getMessages', messageController.getAllMessages); just for testing

	// Getting blogs and adding new blogs
	app.get('/api/blogs',helpers.decode, blogController.getAllBlogs);
	app.post('/api/blogs', blogController.newBlog);
	app.post('/api/blogs/like',helpers.decode, blogController.addLikes);
	app.post('/api/blogs/comment', helpers.decode,blogController.addComment);

	// If a request is sent somewhere other than the routes above,
	// send it through custom error handler
	app.use(helpers.errorLogger);
	app.use(helpers.errorHandler);
};