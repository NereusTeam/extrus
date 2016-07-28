angular.module('RBKme.chat', [])

.controller('chatController', function ($scope, socket) {
	$scope.msg = {};
	$scope.msgs = [];
	$scope.sendMsg = function () {
		socket.chat().emit('send msg');
		$scope.msg.text = '';
	}

	socket.chat().on('get msg', function (data) {
		$scope.msgs.push(data);
		console.log($scope.msgs)
		$scope.$digest()
	})
})

