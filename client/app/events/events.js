angular.module('RBKme.events',[])

.controller('Eventcontroller',function($scope,$mdDialog, $mdMedia, Events,Dialogs, $window){
	$scope.event={};
	$scope.images=[];

	$scope.initialize = function(){
		Events.getImages().then(function(resp){
			console.log(resp)
			$scope.filter(resp.data)
		});
	};

	$scope.filter=function(data){
		for(var i=0;i<data.length;i++){
			var flag = true;
			for (var j = 0; j < $scope.images.length; j++) {
				if($scope.images[j].eventName === data[i].eventName){
					$scope.images[j].image.push(data[i].image);
					flag = false;
				}
			}
			if(flag){
				var image = [];
				image.push(data[i].image)
				$scope.images.push({
						eventName:data[i].eventName,
						image: image
					});
						console.log($scope.images)
			}
		}
	};
	
	$scope.addEvent=function(ev){
		Dialogs.showDialog($scope,$mdDialog,$mdMedia,
	      'newEventController','app/events/newEvent.html',ev,
	      {},function(answer){
	         //$scope.initialize();
	      },function(){
	      	// $scope.initialize();
	        $scope.status = 'You cancelled the dialog.';
	    	}
    	);
	}

	$scope.initialize();
});