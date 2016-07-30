var Events = require('./eventsModel.js')

module.exports={

	getImages : function(req,res){
		console.log('there');
		Events.find({})
		.exec(function(err,images){
			if(err){
				res.status(500).send(error);
			}else{
				res.status(200).send({data:images})

			}
		})
	},
	saveImage : function(req,res){
		var imageurl=req.body.image;
		var eventname=req.body.name;

		Events.findOne({image : imageurl})
		.exec(function(err,image){
			if(!image){
					var event=new Events({
					eventName : eventname,
					image: imageurl
				})
				event.save(function(err,done){
					if(err){
						console.log(err)
					}else{
						res.status(201).send('image have been saved successfully');
					}
				})
			}else{
				res.status(500).send('image already exist');
			}
		})
	}
}