angular.module('RBKme.blog', [])

.controller('BlogController', function ($scope, $mdDialog, $mdMedia, Blogs, Users, Auth, Dialogs, $window) {
	$scope.data = {};

	// calling the isAuth function to know whether the user has signed in or not yet
	$scope.auth = Auth.isAuth;
	$scope.username = $window.localStorage.getItem('username');

	$scope.initalize = function(){

		Blogs.getAll()
		.then(function(blogs){
			$scope.data.blogs = blogs;
			Users.getAll()
			.then(function(users){
				// getting the image and fullname for each user to add it to the blog
				for(var i=0; i<$scope.data.blogs.length; i++){
					for(var j=0; j<users.length; j++){
						if($scope.data.blogs[i].from === users[j].username){
							$scope.data.blogs[i].image = users[j].image;
							$scope.data.blogs[i].name = users[j].firstName + ' ' + users[j].lastName;
							break;
						}
					}
				}
			})
			.catch(function(error){
				console.log(error);
			});
		})
		.catch(function(error){
			console.log(errors);
		});
	};
	
	$scope.like = function(param){
		Blogs.like({username:$scope.username, blogId:param})
		.then(function(result){
			if(result){
				//reload the blogs to show the new number of likes
				$scope.initalize();
			}
		})
	};

	$scope.comment = function(param){
		Blogs.comment({username:$scope.username, blogId:param})
	}

	$scope.addPost = function(ev) {
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
	  Dialogs.showDialog($scope,$mdDialog,$mdMedia,
      'newBlogController','app/blog/newBlog.html',ev,
      {},function(answer){
        $scope.initalize();
      },function(){
        $scope.status = 'You cancelled the dialog.';
      });
  	};

	$scope.initalize();
});
