angular.module('RBKme.chat', [])

.controller('chatController', function ($scope, chat , Users, Messages , $window) {
	$scope.msg = {};
	$scope.msgs = [];
	$scope.data={};
	$scope.sendMsg = function (socket) {
		// send one to one message
		$scope.msg.from = $window.localStorage.getItem('username');
		Messages.sendMessage($scope.msg)
		.then(function(resp){
			if(resp.status === 201)
				console.log('done')
			else{
				alert('Something Went Wrong, Please Try Again!');
			}
		});

		chat.socket().emit('send msg',$scope.msg.to, $scope.msg.text);
		$scope.msg.text = '';
	}

	chat.socket().on('get msg', function (data) {
		$scope.msgs.push(data);
		console.log($scope.msgs)
		$scope.$digest()
	});

	//display all users on screen
	Users.getAll()
		.then(function(users){
			$scope.data.friends = users;
	});


			
})

//$scope.msg.to
