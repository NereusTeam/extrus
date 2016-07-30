var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventsSchema = new Schema({
	eventName: {type: String },
	image: {type:String ,required: true },
	date: { type: Date, default: Date.now }
});

var Events = mongoose.model('Events' , eventsSchema);

module.exports = Events;