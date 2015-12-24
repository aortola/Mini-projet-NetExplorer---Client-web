/**
*   Ceci est une directive personnalisée pour permettre l'upload d'un fichier.
*   Elle s'inclut dans la balise 'input file' de la page de gestion des fichiers & dossiers.
*   Elle réécrit une partie du comportement de cette balise en permettant, une fois le(s) fichier(s) sélectionné(s),
*   de lancer directement la requête d'upload.
**/
app.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function(){};

            element.bind('change', function(e){// réécriture de l'évenement 'change'
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
                        scope.upload(file);// requête d'upload une fois le fichier chargé.
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