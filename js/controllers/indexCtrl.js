app.controller('indexCtrl', ['$scope','connectionFctr',
	function($scope,connectionFctr){
			$scope.targetURL="https://files.netexplorer.pro/api";
			$scope.connectionFctr=connectionFctr;
	}
]);