/**
 * Created by danilig on 15/05/17.
 */
app.factory('misCarrosService', function () {

    var id_carro = 1;
    var precio = 0;

    return {
        id_carro: id_carro,
        getData: function () {
            return precio;
        },
        setData: function (dinero) {
            precio = dinero;
        }
    }

});

app.controller("misCarrosCtrl", function ($http, $scope, $ionicModal, $location, misCarrosService) {
    $scope.verificarToken();
    $scope.carros = {};


    var carros = $http.post($scope.dominio + '/usario/carros/obtenerCarrosUsuario', $scope.token);
    carros.success(function (data, status, headers, config) {
        $scope.carros = data;
        $scope.obtenerPrecioCarros();

    });


    var dinero = 0;
    var indexCarro = 0;
    $scope.obtenerPrecioCarros = function () {
        for (var i = 0; i < $scope.carros.length; i++) {
            if ($scope.carros[i].productos.length === 0) {
                $scope.carros[i].precioCarro = 0;
            } else {
                $scope.carros[indexCarro].precioCarro = 0;
                for (var j = 0; j < $scope.carros[i].productos.length; j++) {
                    var res = $http.get($scope.dominio + '/productoTienda/obtenerProductoTiendaPorId?id=' + $scope.carros[i].productos[j].idProductoTienda);
                    res.success(function (data, status, headers, config) {
                        if (data.historialPrecio.length > 0) {
                            console.log("index:" + data.historialPrecio[data.historialPrecio.length - 1].precio);
                            $scope.carros[indexCarro].precioCarro = $scope.carros[indexCarro].precioCarro + data.historialPrecio[data.historialPrecio.length - 1].precio;
                            console.log($scope.carros[indexCarro].precioCarro);
                        }
                    });
                }

            }

        }

    };


    $scope.click = function (id_carro) {
        misCarrosService.id_carro = id_carro;
        $location.path("/app/productosCarro");
    }

});

app.controller("productosCarroCtrl", function ($http, $scope, $ionicModal, $location, misCarrosService) {
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
            //$scope.productosCarro.precio
        });
    };

    $scope.obtenerProductosCarro();
    console.log($scope.productosCarro);

});