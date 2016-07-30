var blogController = require('../blogs/blogController.js');
var userController = require('../users/userController.js');
var roomsController = require('../roomChat/roomsController.js');
var messageController = require('../messages/messageController.js');
var eventsController =require('../events/eventsController.js');
var helpers = require('./helpers.js');


////////////////////

////////////////////
// exporting DB controller's functions
module.exports = function(app, express){



//This route produces a list of chat as filterd by 'room' query
  app.get('/msg', roomsController.getAllRoomMessages);
	app.post('/api/users/signin', userController.signin);
	app.get('/api/users/signedin', userController.checkAuth);
	app.get('/api/users', userController.getAllUsers);
  app.post('/api/rooms', roomsController.newRoom);
	app.post('/api/users', userController.newUser);
	app.post('/api/users/forget', userController.forgetPassUser);
	app.post('/api/users/editProfile',helpers.decode, userController.editProfile);
	


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

	//adding events

	app.get('/api/users/events',eventsController.getImages)
	app.post('/api/users/events', eventsController.saveImage)
	app.get('/api/users/:id',helpers.decode, userController.getOne);
	app.get('/api/users/:username', userController.getOne);

	// If a request is sent somewhere other than the routes above,
	// send it through custom error handler
	app.use(helpers.errorLogger);
	app.use(helpers.errorHandler);
};