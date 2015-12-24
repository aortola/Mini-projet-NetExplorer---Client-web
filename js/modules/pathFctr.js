/**
*	Il s'agit du module conserve l'état courant de la hiérarchie des répertoires.
*	Se module possède et met à jour le répertoire courant et chaque répertoire précédent
*	constituant son chemin d'accès.
**/
app.factory('pathFctr',
	function(){
		var factory = {
			path : [],
			currentDepth : {},
			setCurrentDepth : function(folderId,folderName){// Fonction de navigation dans la hiérachie.
				if(factory.path.length==0){
					factory.path.push({folderId:folderId,folderName:folderName});
				}else{
					var i=0;
					while(i<factory.path.length && factory.path[i].folderId!=folderId){
						i++;
					}
					if(i==factory.path.length){
						factory.path.push({folderId:folderId,folderName:folderName});
					}else{
						while(factory.path.length>0 && factory.path[factory.path.length-1].folderId!=folderId){
							factory.path.pop();
						}
					}
				}
			},
			getParentFolder : function(){// Fonction pour faire remonter la hiérarchie d'un niveau.
				if(factory.path.length>1){
					return factory.path[factory.path.length-2];
				}else{
					return factory.path[0];
				}
			}
		};
		return factory;
	}
);