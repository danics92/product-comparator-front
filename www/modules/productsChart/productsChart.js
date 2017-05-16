/**
 * Created by danilig on 15/05/17.
 */
app.controller("productosCarroCtrl", function ($http, $scope, $ionicModal, $location, misCarrosService, $window) {
    $scope.verificarToken();

    $scope.productosCarro = {};

    var dataProductosCarro = {
        "accesToken": localStorage.getItem("access_token"),
        "id_carro": misCarrosService.id_carro
    };

    $scope.obtenerProductosCarro = function () {
        $scope.verificarToken();
        var res = $http.post($scope.dominio + '/carro/obtenerProductosCarro', dataProductosCarro);
        res.success(function (data, status, headers, config) {
            $scope.productosCarro = data;
            console.log($scope.productosCarro);
        });
    };
    $scope.delete = function (id_producto) {
        $scope.verificarToken();
        for (var i = 0; i < $scope.productosCarro.length; i++) {
            if ($scope.productosCarro[i].idProducto === id_producto) {
                dataProductosCarro = {
                    access_token: localStorage.getItem("access_token"),
                    id_carro: misCarrosService.id_carro,
                    id_producto: id_producto
                };
                var res = $http.post($scope.dominio + '/carro/deleteProductosCarro', dataProductosCarro);
                res.success(function (data, status, headers, config) {
                    $scope.obtenerProductosCarro();
                });
            }

        }
    };

    $scope.obtenerProductosCarro();
    console.log($scope.productosCarro);

});