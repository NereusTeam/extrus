angular.module('RBKme.chat', [])


.controller('chatController', function ($scope, socket, Users, Messages , $window) {
	$scope.msg = {};
	$scope.msgs = [];
	$scope.msg.from = $window.localStorage.getItem('username');
	console.log($scope.msg.from)
	$scope.data={};
	$scope.sendMsg = function () {
		socket.chat().emit('send msg', {to: $scope.msg.to, from: $scope.msg.from, text:$scope.msg.text});
		$scope.msg.text = '';
		console.log($scope.msg.to)
	}

	socket.chat().on('get msg'+$scope.msg.from, function (data) {
		$scope.msgs.push(data);
		console.log($scope.msgs)
		$scope.$digest()

	})
	Users.getAll()
		.then(function(users){
			$scope.data.friends = users;
	});
})
