var mongoose = require('mongoose');

var RoomsSchema = mongoose.Schema({
  roomName:String
});

// create a model from the chat schema
var Rooms = mongoose.model('Rooms', RoomsSchema);

module.exports = Rooms;

