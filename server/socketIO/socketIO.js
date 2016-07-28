var Chat = require('../socketIO/socketIOmodel.js')
var Message = require('../messages/messageModel.js');
var User = require('../users/userModel.js');
  
//Listen for connection
module.exports = function (io){
  io.sockets.on('connection', function(socket) {
    console.log('connected')
    socket.on('send msg',function(data){
      console.log(data.to)
      var message=new Message({
        from:data.from,
        to:data.to,
        text:data.text,
        data:new Date()
      })
      message.save(function(err,saved){
        io.sockets.emit('get msg'+data.to ,data);
      })
    })
    // socket.on('send msg', function (data) {
    //   var newChat = new Chat({
    //                           created: new Date(),
    //                           content: data,
    //                           username: 'hosuam',
    //                           room: 'socet.io'
    //                         });
    //   newChat.save(function(err, savedChat) {
    //     console.log(savedChat);
    //     io.sockets.emit('get msg', data)
    //   });
    // });

    var defaultRoom = 'general';
    var rooms = ["General", "angular", "socket.io", "express", "node", "mongo", "PHP", "laravel"];

    //Emit the rooms array
    socket.emit('setup', {
      rooms: rooms
    });
    
    socket.on('new user', function(data) {
      data.room = defaultRoom;
      //New user joins the default room
      socket.join(defaultRoom);
      //Tell all those in the room that a new user joined
      io.in(defaultRoom).emit('user joined', data);
    });

    socket.on('switch room', function(data) {
      //Handles joining and leaving rooms
      //console.log(data);
      socket.leave(data.oldRoom);
      socket.join(data.newRoom);
      io.in(data.oldRoom).emit('user left', data);
      io.in(data.newRoom).emit('user joined', data);
    });

    socket.on('new message', function(data) {
      //Create message
      var newMsg = new Chat({
        username: data.username,
        content: data.message,
        room: data.room.toLowerCase(),
        created: new Date()
      });
      //Save it to database
      newMsg.save(function(err, msg){
        //Send message to those connected in the room
        io.in(msg.room).emit('message created', msg);
      });
    });
  });
}
