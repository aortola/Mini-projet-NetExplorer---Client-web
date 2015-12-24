/**
*	Module de gestion des dossiers. Charge les modules de connection et de gestion de la hiérarchie.
*	Ce module sert à representer le dossier courant sur la page de gestion des fichiers et dossiers.
*	Il possède toutes les informations concernant le répertoire courant et permet de récupérer
*	un dossier ciblé ou le dossier racine.
**/
app.factory('folderFctr',['$http','connectionFctr','pathFctr',
	function($http,connectionFctr,pathFctr){
		var factory = {
			folder : {},
			getFilesFromRoots : function(targetURL,depth){// Fonction de récupération du dossier racine
				$http.get(targetURL+'/folder/'+connectionFctr.infos.roots+'?depth='+depth+'&full=1')
				.success(function(data,status){
					factory.folder=data;
					pathFctr.setCurrentDepth(data.id,data.name);
				});
			},
			getFilesFromFolder : function(targetURL,folderId,depth){// Fonction de récupération d'un dossier ciblé
				$http.get(targetURL+'/folder/'+folderId+'?depth='+depth+'&full=1')
				.success(function(data,status){
					factory.folder=data;
					pathFctr.setCurrentDepth(data.id,data.name);
				});
			}
		};
		return factory;
	}
]);