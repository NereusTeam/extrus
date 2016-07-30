var Blog = require('./blogModel.js');
var Q = require('q');
// Promisify a few mongoose methods with the `q` promise library

var findAllBlogs = Q.nbind(Blog.find, Blog);



module.exports = {
	getAllBlogs : function(req,res){
		Blog.find()
		.sort({date: -1})
		.exec(function(error,blogs){
			if(error){
				res.status(500).send(error);
			} else {
				res.json(blogs);
			}
		});
	},

	newBlog : function(req,res,next){
	
		var newBlog = new Blog ({
			//from : req.body.username,
			from : req.body.username,
			title : req.body.title,
			blog : req.body.blog,
			image : req.body.image
		});

		newBlog.save(function(err, newBlog){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(200).send(newBlog);
			};
		});
	},

	save : function (req,res,blog,status){
		blog.save(function (error, result) {
						if(error){
							res.status(500).send(error)
						}else{
							res.status(200).send(status);
						}
					})
	},

	addLikes : function(req,res){
		//var username = req.body.username;
		var username = req.user.username;
		var blogId = req.body.blogId;

		Blog.findOne({_id:blogId})
		.exec(function (error, blog){
			if(error){
				res.status(500).send(error);
			}else{
				if(!blog.likes.includes(username)){
					blog.likes.push(username);
					module.exports.save(req,res,blog,"like");
				}else{
					blog.likes.splice(blog.likes.indexOf(username),1);
					module.exports.save(req,res,blog,"unlike")
				}
			}
		})
	}, 

	addComment : function (req,res) {
		//var username = req.body.username;
		var username = req.body.username;
		var blogId = req.body.blogId;
		var comment = req.body.comment;

		Blog.findOne({_id:blogId})
		.exec(function(error, blog){
			if(error){
				res.status(500).send(error);
			}else{
				var obj = {username:req.body.username , comment : req.body.comment};
				blog.comments.push(obj);
				module.exports.save(req,res,blog,"comment success!!");
			}
		})
	}
}