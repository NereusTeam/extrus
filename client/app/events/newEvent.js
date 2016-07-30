angular.module('RBKme.newEvent', [])

.controller('newEventController', function ($scope,Events, $mdDialog, Blogs, $window) {

	$scope.event = {};
	
	// A flag to check if inputs filled or not
	$scope.filled = true;
	
	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
    	$mdDialog.cancel();
	};
	$scope.getImage = function(){

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
					$scope.event.image = result.link;
					$scope.changedFlag = true;
					$scope.answer();
				});
			})
			// using the reader to decode the image to base64
			reader.readAsDataURL(file);
		})
		fileBt.click();
	};

	$scope.answer = function() {
		$scope.filled = true;
		// checking if all inputs are filled
		if(!$scope.event.name || !$scope.event.image){
			handleBlogInputs($scope,'Please fill all fields');
		} else {
			$scope.event.username = $window.localStorage.getItem('username');
				Events.saveImage($scope.event).then(function(resp){
					console.log(resp);
				});
				$scope.hide();
		}
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