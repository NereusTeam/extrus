var Chat = require('../socketIO/socketIOmodel.js')

  
//Listen for connection
module.exports = function (io){
  io.sockets.on('connection', function(socket) {
    console.log('connected')
    socket.on('send msg', function (data) {
      io.sockets.emit('get msg', data)
    })
  });
}