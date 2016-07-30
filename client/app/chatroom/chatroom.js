angular.module('RBKme.chatroom', [])





.directive('scrollBottom', function () {
  return {
    scope: {
      scrollBottom: "=scrollBottom"
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight+1);
        }
      });
    }
  }
})


.controller('chatroomController', function ($scope, socket, Users, Messages , $window) {

	$scope.data={};
  $scope.curentUser={};
  $scope.toUser={};


  $scope.initalize = function(){
    Users.getAll()
    .then(function(users){
      $scope.data.users = users;
    })
    .catch(function (error) {
      console.error(error);
    });

    Users.getOne(window.localStorage.getItem('username'))
    .then(function(user){
      $scope.curentUser=user;
      console.log($scope.curentUser);
    })
    .catch (function(error){
      console.log(error);
    })

    
  };




  $scope.initalize();

  $scope.sendMessage = function () {
    var mesg={ 
      from : $scope.curentUser.username ,
      to :   $scope.toUser.username,
      text : $scope.messageText
    };

    socket.chat().emit('send msg', mesg);
    $scope.data.messages.push(mesg);
    $scope.messageText = '';
  }
    console.log('get msg'+window.localStorage.getItem('username'));

  socket.chat().on('get msg'+window.localStorage.getItem('username'), function (data) {
    console.log('asdasd');
    $scope.data.messages.push(data);
    $scope.$digest();
    //$scope.initalize();
    console.log($scope.data.messages);

  })


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

  // $scope.sendMessage=function(){
  //   var mesg={ 
  //     from : $scope.curentUser.username ,
  //     to :   $scope.toUser.username,
  //     text : $scope.messageText
  //   };

  //   Messages.sendMessage(mesg)
  //     .then(function(response){
  //       if(response.status === 201){
  //         $scope.data.messages.push(mesg);
  //       } else {
  //         alert('Something Went Wrong, Please Try Again!');
  //       }
  //       $scope.messageText="";
  //     })
  //     .catch(function(error){
  //       console.log(error);
  //     });

  //   console.log(mesg);


  // }
  
})


