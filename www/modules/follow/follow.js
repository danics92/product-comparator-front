/**
 * Created by danilig on 15/05/17.
 */
app.controller("seguimientoCtrl", function($http, $scope,$ionicModal,$location){
    $scope.verificarToken();

    $scope.seguimientos = {};

    $scope.obtenerSeguimientos = function(){
        $scope.verificarToken();

        var res = $http.post($scope.dominio + '/usuario/seguimiento/ObtenerTodosLosSeguimientos',$scope.token);
        res.success(function (data, status, headers, config) {
            $scope.seguimientos = data;
            console.log($scope.seguimientos);
            var valoraciones = 0;
            var totalValoracion = 0;
            for(var x = 0; x < $scope.seguimientos.length;x++){
                if($scope.seguimientos[x].productoValoracion.length === 0){
                    $scope.seguimientos[x].productoValoracion = totalValoracion;
                }else{
                    for(var j = 0; j < $scope.seguimientos[x].productoValoracion.length;j++){
                        valoraciones = valoraciones + $scope.seguimientos[x].productoValoracion[j].valoracion;
                    }
                    totalValoracion = valoraciones / $scope.seguimientos[x].productoValoracion.length;
                    $scope.seguimientos[x].productoValoracion = totalValoracion;
                    totalValoracion = 0;
                    valoraciones = 0;
                }
            }

            var index = 0;

            for(var i = 0; i < $scope.seguimientos.length ;i++){
                var marcas = $http.get($scope.dominio + '/marca/obtenerMarcaPorId?id='+$scope.seguimientos[i].idMarca);
                marcas.success(function (data, status, headers, config) {
                    $scope.seguimientos[index].idMarca = data;
                    index++;
                });
            }

        });
    };

    $scope.obtenerSeguimientos();


});