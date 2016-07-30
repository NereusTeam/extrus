angular.module('RBKme.newBlog', [])

.controller('newBlogController', function ($scope, $mdDialog, Blogs, $window) {

	$scope.blog = {};
	
	// A flag to check if inputs filled or not
	$scope.filled = true;
	
	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
    	$mdDialog.cancel();
	};

	$scope.answer = function() {

		$scope.filled = true;
		// checking if all inputs are filled
		if(!$scope.blog.title || !$scope.blog.blog){
			handleBlogInputs($scope,'Please fill all fields');
		} else {
			$scope.blog.username = $window.localStorage.getItem('username');
			// adding a blog
			Blogs.addOne($scope.blog)
			.then(function(response){
				if(response.status === 200){
					//clearing input boxes
					clearBlogInputBoxes($scope);
					$mdDialog.hide();
				} else {
					alert('Something Went Wrong, Please Try Again!');
				}
			})
			.catch(function(error){
				console.log(error);
			});
		}
	};

	$scope.choosePic = function(){

		var uploadToIMGUR = window.uploadToIMGUR;
		var IMGUR_CLIENT_ID = window.IMGUR_CLIENT_ID;
		
		var fileBt = $('<input>').attr('type','file');
		fileBt.on('change', () => {
			var file = fileBt[0].files[0];
			var reader = new FileReader();
			reader.addEventListener('load', ()=>{
				var imgData = reader.result.slice(23);
				// sending the decoded image to IMGUR to get a link for that image
				uploadToIMGUR(IMGUR_CLIENT_ID, imgData, function(result){
					console.log(result.link)
					$scope.blog.image = result.link;
					$scope.changedFlag = true;
				});
			})
			// using the reader to decode the image to base64
			reader.readAsDataURL(file);
		})
		fileBt.click();
	};

});
	
var handleBlogInputs = function($scope, msg){
	clearBlogInputBoxes($scope);
	$scope.filled = false;
	$scope.errorMsg = msg;
};

// function to clear the input boxes
var clearBlogInputBoxes = function($scope) {
	$scope.blog.username = '';
	$scope.blog.title = '';
	$scope.blog.blog = '';
};