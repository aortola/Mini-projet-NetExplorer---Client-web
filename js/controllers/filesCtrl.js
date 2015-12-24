/**
*	Il s'agit du controleur associé à la page degestion de fichiers & dossiers.
*	Il charge le module de gestion des répertoires, le module de gestion de la hérarchie, 
*	le module http pour effectuer des requêtes, le module de gestion de la connexion.
*	Dès chargement de la page il effectue une requête pour lister les fichiers et dossiers de l'utilisateur.
*	C'est ici que sont définies les fonctions de gestion des fichiers et dossiers (téléchargement,téléversement et suppression).
*/

app.controller('filesCtrl', ['$scope','folderFctr','pathFctr','$http','connectionFctr','$window',

	function($scope,folderFctr,pathFctr,$http,connectionFctr,$window){

		$scope.folderFctr=folderFctr;
		$scope.pathFctr=pathFctr;
		$scope.folderFctr.getFilesFromRoots($scope.targetURL,'1');//requête initiale vers le répertoire racine de l'utilisateur connecté

		$scope.download=function(fileId,fileName){//requête de téléchargement du fichier passé en paramètre
			$http.get($scope.targetURL+'/file/'+fileId+'/download',{responseType:'arraybuffer'})// il faut spécifier que le contenu de la réponse se fera en binaire
				.success(function(data,status,headers,config){
					var blob = new Blob([data],{type:headers("Content-type")});// "Blobification" des données reçues en spécifiant le type réel du contenu.
	                if(blob){// Aucun traitement ne sera effectué si la "Blobification" n'a pas fonctionnée.
	                    /**
	                	*	La partie ci-dessous rajoute momentanément un morceau de HTML puis le retire après utilisation.
	                	*	Il s'agit d'une balise de lien avec l'attribut "download" pointant vers le blob fraichement créé.
	                	*	Elle gère les cas ou le navigateur ne supporterai pas la propriété window.URL.
	                	*	Je n'ai pas trouvé de meilleure façon aussi simple de permettre le téléchargement d'un fichier. 
	                	*/
	                    var downloadLink = document.createElement("a");
	                    downloadLink.download = fileName;
	                    downloadLink.innerHTML = "Download File";
	                    if (window.webkitURL != null){
	                        downloadLink.href = window.webkitURL.createObjectURL(blob);
	                    }
	                    else{
	                        downloadLink.href = window.URL.createObjectURL(blob);
	                        downloadLink.style.display = "none";
	                        document.body.appendChild(downloadLink);
	                    }
	                    downloadLink.click();
	                   	downloadLink.remove();
	                }
				});
		};

		$scope.upload=function(file){ // fonction de téléversement des fichiers vers la plateforme.
	        var fd = new FormData(); // utilisation d'un formData pour structurer l'envoi du fichier.
	        fd.append('folderId', $scope.folderFctr.folder.id);// on spécifie l'id du répertoire ciblé par l'upload.
	        fd.append('targetFile', file);// on fournit le contenu du fichier lu, ainsi que ses informations.
	        $http.post($scope.targetURL+'/file/upload?full=1', fd, {
	            transformRequest: angular.identity,
	            /**
	            *	L'ajout de la balise "boundaries" dans le header se fait automatiquement après génération complète de la requête.
	            *	Si, au sein d'angular, on spécifie le content-type manuellement (avec multipart/form-data par exemple) l'identifiant unique
	            *	des balises "boundaries" ne s'ajoute pas. Pour contourner cela il faut spécifier manuellement "undefined".
	            *	De cette façon une nouvelle verification sera effectuée.
	            */
	            headers: {'Content-Type': undefined}  
	        })
	        .success(function(){
	        	$scope.folderFctr.getFilesFromFolder($scope.targetURL,$scope.folderFctr.folder.id,1); // on recharge le contenu de la page courante
	        })
	        .error(function(){
	        	alert("Echec de l'upload du fichier.");
	        });
		};

		$scope.deleteFile=function(fileId,trash){
			$http.delete($scope.targetURL+'/file/'+fileId+'?trash='+trash)// fonction de suppression d'un fichier
			.success(function(data,status,headers,config){
				$scope.folderFctr.getFilesFromFolder($scope.targetURL,$scope.folderFctr.folder.id,1);// on recharge le contenu de la page courante
			});
		};

		$scope.deleteFolder=function(folderId,trash){
			$http.delete($scope.targetURL+'/folder/'+folderId+'?trash='+trash)// fonction de suppression d'un dossier
			.success(function(data,status,headers,config){
				$scope.folderFctr.getFilesFromFolder($scope.targetURL,$scope.folderFctr.folder.id,1);// on recharge le contenu de la page courante
			});
		};
	}
]);