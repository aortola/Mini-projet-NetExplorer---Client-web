/**
*	Module gérant l'état de la connexion d'un utilisateur.
*	Ce module possède toutes l'informations d'un utilisatteur retournées par l'API NetExplorer.
*	Elle permet de s'authentifier et de se déconnecter.
**/
app.factory('connectionFctr',['$http','$location',
	function($http,$location){
		var factory = {
			connected : false,
			infos : {},
			login : '',
			token : '',
			auth_key : '',
			logIn : function(targetURL,login,password){ // Fonction d'authentification
				$http.post(targetURL+'/auth',
					{	
						user:login,
						password:password
					}
				).success(function(data,status){
					factory.connected=true;
					factory.login=login;
					factory.token=data.token;
					$http.defaults.headers.common.token=data.token;// Insertion du token de connexion dans les futurs headers 
					factory.auth_key=data.auth_key;
					$http.get(targetURL+'/account').success(function(data,status){// Requête des informations personnelles de l'utilisateur connecté.(Afin de récupérer l'id du repertoire racine)
 						factory.infos=data;
 						$location.path("/files");// Redirection vers la page de gestion des fichiers.
					});
					
				});
			},
			logOut : function(targetURL){ // Fonction de déconnexion.
				$http.delete(targetURL+'/auth').success(function(data,status){
					factory.connected=false;
					$location.path('/');
				});
			}
		};
		return factory;
	}
]);