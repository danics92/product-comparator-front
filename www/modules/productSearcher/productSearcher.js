/**
 * Created by danilig on 15/05/17.
 */
app.controller("productosCtrl", function($http, $scope,$ionicModal,$location){
    $scope.verificarToken();
    console.log("dentro de productosCtrl");
    $scope.productos = {};

    $scope.dominio = "http://localhost:3005";

    $scope.obtenerProductosCarro = function(){
        $scope.verificarToken();
        var res = $http.get($scope.dominio + '/producto/obtenerTodosProductos');
        res.success(function (data, status, headers, config) {
            console.log("productos:"+data);
            $scope.productos = data;
        });
    };

    $scope.obtenerProductosCarro();


});