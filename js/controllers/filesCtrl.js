app.controller('filesCtrl', ['$scope','folderFctr','pathFctr','$http','connectionFctr','$window',
	function($scope,folderFctr,pathFctr,$http,connectionFctr,$window){
		$http.defaults.headers.common.token=connectionFctr.token;
		$scope.folderFctr=folderFctr;
		$scope.pathFctr=pathFctr;
		$scope.folderFctr.getFilesFromRoots($scope.targetURL,'1');
		$scope.download=function(fileId,fileName){
			$http.get($scope.targetURL+'/file/'+fileId+'/download',{responseType:'arraybuffer'})
				.success(function(data,status,headers,config){
					var blob = new Blob([data],{type:headers("Content-type")});
	                if(blob){
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

		$scope.upload=function(file){

	        var fd = new FormData();
	        //fd.append('targetPath',);
	       	//fd.append('fileSize',);
	        fd.append('folderId', $scope.folderFctr.folder.id);
	        fd.append('targetFile', file);
	        $http.post($scope.targetURL+'/file/upload?full=1', fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(){
	        })
	        .error(function(){
	        });
		};
	}
]);