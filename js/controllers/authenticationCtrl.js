/**
*	Il s'agit du controleur de la page d'authentification.
*	Il utilise essentiellement le module de connexion.
*	Il permet d'effectuer la requête de connexion auprès de l'API NetExplorer et éventuellement de réinitialiser 
*	un mot de passe perdu associer au login.(Sans autre vérification).
*/
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

		$scope.resetPassword=function(){
			$http.post($scope.targetURL+'/reset_password',
			{
				"login_or_email": $scope.connection.login
	        })
	        .success(function(){
	        	alert("An e-mail has been sent to you.");
	        })
	        .error(function(){
	        	alert("This login doesn't exist.");
	        });
		}
	}
]);