var Chat = require('../socketIO/socketMessagesModel.js')
var Message = require('../messages/messageModel.js');
var User = require('../users/userModel.js');
var Room = require('../roomChat/roomsModel.js');
  
//Listen for connection
module.exports = function (io){
  io.sockets.on('connection', function(socket) {
    console.log('connected')
    socket.on('send msg',function(data){
      var message=new Message({
        from:data.from,
        to:data.to,
        text:data.text,
        data:new Date()
      })
      message.save(function(err,saved){
        io.sockets.emit('get msg'+data.to ,saved);
        console.log('get msg'+data.to)
      })
    })
    

     //Emit the rooms array
    Room.find().exec(function(err, allRooms){
        socket.emit('setup', {
        rooms: allRooms
      });
    })
     //Emit the users array
    User.find().exec(function(err, allUsers){
      socket.emit('setup', {
        users: allUsers
      });
    })
   
    
    
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
