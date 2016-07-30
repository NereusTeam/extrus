angular.module('RBKme.chat', [])


.controller('chatController', function ($scope, socket, Users, Messages , $window, Rooms) {

	$scope.newRoom = {};
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

	socket.chat().on('setup', function (data) {
		if(data.rooms !== undefined){
        	$scope.data.rooms = data.rooms;
        	$scope.$digest()
        	$scope.room = $scope.data.rooms[0].roomName;
        	Rooms.getMessages($scope.room).then(function (msgs) {
            	$scope.msgs = msgs;
            	console.log(msgs)
        	});
		}
        if(data.users !== undefined){
        	$scope.data.friends = data.users;
        	$scope.$digest()
        }
    });

	$scope.addRoom = function () {
		Rooms.addNewRoom($scope.newRoom).then(function (room) {
			$scope.data.rooms.push(room)
		})
	}
	socket.chat().on('get msg'+$scope.msg.from, function (data) {
		$scope.msgs.push(data);
		$scope.$digest()

	})
    $scope.changeRoom = function (clickedRoom) {
        $scope.room = clickedRoom.toUpperCase();
        socket.chat().emit('switch room', {
            newRoom: clickedRoom,
            username: $scope.msg.from
        });
        Rooms.getMessages(clickedRoom).then(function (msgs) {
            $scope.msgs = msgs;
            console.log(msgs)
        });
    };
    socket.chat().on('message created', function (data) {
        $scope.msgs.push(data);
    });
    $scope.send = function (msg) {
        socket.chat().emit('new message', {
            room: $scope.room,
            message: msg,
            username: $scope.msg.from
        });
    };

})
