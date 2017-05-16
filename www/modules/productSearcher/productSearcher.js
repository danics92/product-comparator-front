/**
 * Created by danilig on 15/05/17.
 */
app.controller("productosCtrl", function($http, $scope,$ionicModal,$location){
    $scope.verificarToken();
    $scope.productos = {};

    $scope.dominio = "http://localhost:3005";
    $scope.favorite = false;
    $scope.favoriteImg = "favorite_border";

    $scope.obtenerProductosCarro = function(){
        $scope.verificarToken();
        var res = $http.get($scope.dominio + '/producto/obtenerTodosProductos');
        res.success(function (data, status, headers, config) {
            $scope.productos = data;
        });
    };

    $scope.obtenerProductosCarro();

    $scope.addFavorite = function(id_producto){
        $scope.verificarToken();
        $scope.favoriteImg = "favorite";

        var data = {
            access_token: localStorage.getItem("access_token"),
            idProducto: id_producto
        };
        var res = $http.get($scope.dominio + '/usuario/newFavorito',data);
        res.success(function (data, status, headers, config) {
            console.log(data);
        });
    };

    $scope.removeFavorite = function(id_producto){
        $scope.verificarToken();
        $scope.favoriteImg = "favorite_border";
        var data = {
            access_token: localStorage.getItem("access_token"),
            idProducto: id_producto
        };
        var res = $http.get($scope.dominio + '/usuario/removeFavorito',data);
        res.success(function (data, status, headers, config) {
            console.log(data);
        });
    }

    $scope.favoriteManager = function(id_producto){
        if(!$scope.favorite){
            console.log("add");
            $scope.addFavorite(id_producto);

        }
        else {
            $scope.removeFavorite(id_producto);
            console.log("remove");
        }
        $scope.favorite= !$scope.favorite;
    };

});