angular.module('RBKme.chat', [])

.controller('chatController', function ($scope, chat) {
	$scope.msg = {};
	$scope.msgs = [];
	$scope.sendMsg = function (socket) {
		chat.socket().emit('send msg', $scope.msg.text);
		$scope.msg.text = '';
	}

	chat.socket().on('get msg', function (data) {
		$scope.msgs.push(data);
		console.log($scope.msgs)
		$scope.$digest()
	})
})