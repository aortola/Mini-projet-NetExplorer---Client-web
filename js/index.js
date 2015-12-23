var app = angular.module('app',['ngRoute','ngAnimate','ui.bootstrap']);

app.config(function ($routeProvider){
	$routeProvider.when('/authentication',{templateUrl: 'partials/authentication.html'});
	$routeProvider.when('/files',{
		templateUrl: 'partials/files.html',
		resolve:{
			"checkConnection":function(connectionFctr,$location){
				if(!connectionFctr.connected){
					$location.path('/');
					//alert("Please, fill in actual credentials.");
				}
			}
		}
	
	});
	$routeProvider.otherwise({redirectTo:'/authentication'});
});

app.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function(){};

            element.bind('change', function(e){
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                    });

                function readFile(file){
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                        scope.upload(file);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }
            });
        }
    };
});

app.factory('connectionFctr',['$http','$location',
	function($http,$location){
		var factory = {
			connected : false,
			infos : {},
			login : '',
			token : '',
			auth_key : '',
			logIn : function(targetURL,login,password){
				$http.post(targetURL+'/auth',
					{	
						user:login,
						password:password
					}
				).success(function(data,status){
					factory.connected=true;
					factory.login=login;
					factory.token=data.token;
					$http.defaults.headers.common.token=data.token;
					factory.auth_key=data.auth_key;
					$http.get(targetURL+'/account').success(function(data,status){
 						factory.infos=data;
 						$location.path("/files");
					});
					
				});
			},
			logOut : function(targetURL){
				$http.delete(targetURL+'/auth').success(function(data,status){
					factory.connected=false;
					$location.path('/');
				});
			}
		};
		return factory;
	}
]);

app.factory('folderFctr',['$http','connectionFctr','pathFctr',
	function($http,connectionFctr,pathFctr){
		var factory = {
			folder : {},
			getFilesFromRoots : function(targetURL,depth){
				$http.get(targetURL+'/folder/'+connectionFctr.infos.roots+'?depth='+depth+'&full=1')
				.success(function(data,status){
					factory.folder=data;
					pathFctr.setCurrentDepth(data.id,data.name);
				});
			},
			getFilesFromFolder : function(targetURL,folderId,depth){
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

app.factory('pathFctr',
	function(){
		var factory = {
			path : [],
			currentDepth : {},
			setCurrentDepth : function(folderId,folderName){
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
			getParentFolder : function(){
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