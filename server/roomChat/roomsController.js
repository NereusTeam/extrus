var Room = require('./roomsModel.js');
var Chat = require('../socketIO/socketMessagesModel.js')

module.exports = {
	getAllRoomMessages: function (req, res) {
		Chat.find({
    		'room': req.query.room.toLowerCase()
  		}).exec(function(err, msgs) {
	    	//Send
	    	res.json(msgs);
  		});
	},

	newRoom: function (req, res) {
	    var roomName=req.body.roomName;
	    var newRoom = new Room ({
	      roomName: roomName
	    });
	    
	    newRoom.save(function(err, newRoom){
	      if(err){
	        res.status(500).send(err);
	      } else {
	        res.status(200).send(newRoom);
	      };
	    });
	}
}
