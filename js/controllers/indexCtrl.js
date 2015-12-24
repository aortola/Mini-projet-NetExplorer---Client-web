/**
*	Il s'agit du controleur associé à l'index. 
*	On conserve ici le tronc de l'URL pour requêter l'API NetExplrorer, de cette façon elle sera accessible depuis tous les scopes enfants.
*	On charge également le module de connexion pour gérer la déconnexion dans barre de navigation du header.
*/
app.controller('indexCtrl', ['$scope','connectionFctr',
	function($scope,connectionFctr){
			$scope.targetURL="https://files.netexplorer.pro/api";
			$scope.connectionFctr=connectionFctr;
	}
]);