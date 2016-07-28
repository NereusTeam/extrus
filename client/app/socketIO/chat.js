angular.module('RBKme.chat', [])


.controller('chatController', function ($scope, socket, Users, Messages , $window) {
	$scope.msg = {};
	$scope.msgs = [];
	$scope.msg.from = $window.localStorage.getItem('username');
	$scope.sendMsg = function () {
		socket.chat().emit('send msg');
		$scope.msg.text = '';
	}

	socket.chat().on('get msg', function (data) {
		$scope.msgs.push(data);
		console.log($scope.msgs)
		$scope.$digest()

	})
	Users.getAll()
		.then(function(users){
			$scope.data.friends = users;
	});
})
