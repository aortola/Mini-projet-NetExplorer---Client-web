app.controller('authenticationCtrl', ['$scope','connectionFctr',
	function($scope,connectionFctr){
		$scope.login=function(){
			connectionFctr.logIn($scope.targetURL,$scope.connection.login,$scope.connection.password);
		};

		$scope.keyDown=function (event){
			if(event.keyCode==13){
				$scope.login();
			}
		};
	}
]);