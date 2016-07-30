angular.module('RBKme.socketIO', [])


.controller('ScotchCtrl', function ($scope, $mdDialog, socket, room) {
    $scope.messages = [];
    $scope.room = "";




    socket.on('user joined', function (data) {
        console.log(data.username + ' has joined');
    });
    socket.on('setup', function (data) {
        var rooms = data.rooms;;
        console.log(rooms);
        $scope.rooms = rooms;
    });
    $scope.changeRoom = function (clickedRoom) {
        $scope.room = clickedRoom.toUpperCase();
        socket.emit('switch room', {
            newRoom: clickedRoom,
            username: $scope.username
        });
        room.getMessages(clickedRoom).then(function (msgs) {
            $scope.messages = msgs;
        });
    };
    //Launch Modal
    $scope.usernameModal = function (ev) {
        $mdDialog.show({
                controller: UsernameDialogController,
                templateUrl: 'app/scotch/public/partials/username.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
            })
            .then(function (answer) {
                $scope.username = answer;
                $scope.alert = 'Username: "' + answer + '".';
                socket.emit('new user', {
                    username: answer
                });
                $scope.room = 'GENERAL';
                room.getMessages($scope.room).then(function (msgs) {
                    $scope.messages = msgs;
                });
            }, function () {

            });
    };
    socket.on('message created', function (data) {
        $scope.messages.push(data);
    });
    $scope.send = function (msg) {
        socket.emit('new message', {
            room: $scope.room,
            message: msg,
            username: $scope.username
        });

    };
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function UsernameDialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}