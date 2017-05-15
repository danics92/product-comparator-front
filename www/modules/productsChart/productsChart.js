/**
 * Created by danilig on 15/05/17.
 */
app.controller("productosCarroCtrl", function($http, $scope,$ionicModal,$location,misCarrosService){
    $scope.verificarToken();

    $scope.productosCarro = {};

    var dataProductosCarro = {
        "accesToken":  localStorage.getItem("access_token"),
        "id_carro": misCarrosService.id_carro
    };

    $scope.obtenerProductosCarro = function(){
        $scope.verificarToken();
        var res = $http.post($scope.dominio + '/carro/obtenerProductosCarro', dataProductosCarro);
        res.success(function (data, status, headers, config) {
            $scope.productosCarro = data;
            console.log($scope.productosCarro);
            //$scope.productosCarro.precio
        });
    };

    $scope.obtenerProductosCarro();
    console.log($scope.productosCarro);

});