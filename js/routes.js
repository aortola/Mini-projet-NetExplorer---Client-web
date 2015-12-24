/**
*	Cette partie de script représente le point d'entrée de l'application côté angularJS.
*	Ici sont chargés les modules externes à angularJS tels que le routage, les animations et le lien entre bootstrap et angularJS.
**/
var app = angular.module('app',['ngRoute','ngAnimate','ui.bootstrap']);

/**
*	Puis ici on établie la configuration générale de l'application.
*	En l'occurence on ne s'occupe que du routage.
**/
app.config(function ($routeProvider){
	$routeProvider.when('/authentication',{templateUrl: 'partials/authentication.html'});
	$routeProvider.when('/files',{
		templateUrl: 'partials/files.html',
		/**
		*	On n'accède à la page de gestion des fichiers et dossiers
		*	que si l'on est connecté. Autrement il y aura redirection vers
		*	l'authentification.
		**/
		resolve:{
			"checkConnection":function(connectionFctr,$location){
				if(!connectionFctr.connected){
					$location.path('/');
					//alert("Please, fill in actual credentials.");
				}
			}
		}
	
	});
	$routeProvider.otherwise({redirectTo:'/authentication'});// Si l'utilisateur tente d'accéder à une page non référencée il sera renvoyé à l'accueil.
});