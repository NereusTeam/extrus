angular.module('RBKme.chatroom', [])
.controller('chatroomController', function ($scope, Users ,Messages) {

	$scope.data={};
  $scope.curentUser={};
  $scope.toUser={};
  $scope.flagFrom=true;
  $scope.flagTo=true;


  $scope.initalize = function(){
    Users.getAll()
    .then(function(users){
      $scope.data.users = users;
    })
    .catch(function (error) {
      console.error(error);
    });

    Users.getOne(window.username)
    .then(function(user){
      $scope.curentUser=user;
      console.log($scope.curentUser)
    })
    .catch (function(error){
      console.log(error);
    })

    
  };




  $scope.initalize();

  $scope.setUser = function(user) {
    $scope.toUser=user;
    Messages.getMessages({username:$scope.curentUser.username , friend :user.username})
    .then(function(messages){
      console.log(messages);  
      console.log($scope.curentUser)
      $scope.data.messages=messages;
    })
    .catch(function(error){
      console.log(error);
    })

  }
  
});
