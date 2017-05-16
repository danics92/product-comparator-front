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

app.controller("misCarrosCtrl", function ($http, $scope, $ionicModal, $location, misCarrosService, $ionicPopup) {
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

    $scope.delete = function (id_carro) {
        $scope.verificarToken();
        var dataCarro = {
            "accesToken": localStorage.getItem("access_token"),
            "id_carro": id_carro
        };
        console.log(dataCarro);
        var res = $http.post($scope.dominio + '/carro/eliminarCarroUsuario', dataCarro);
        res.success(function (data, status, headers, config) {
            for (var i = 0; i < $scope.carros.length; i++) {
                if ($scope.carros[i].id === id_carro) {
                    $scope.carros.slice(1, i);
                }
            }
            console.log("Borrado cone exito");

        });
    };
    $scope.addCart = function () {
        $scope.verificarToken();
        $ionicPopup.prompt({
            title: 'Introduzca el nombre del carro',
            inputType: 'text',
            inputPlaceholder: 'Nuevo nombre'
        }).then(function (res) {
            var dataCarro = {
                "accesToken": localStorage.getItem("access_token"),
                "name": res
            };
            var res = $http.post($scope.dominio + '/carro/newCarro', dataCarro);
            res.success(function (data, status, headers, config) {
                //PONER MENSAJE
            });
        });

    };

    $scope.editCart = function (id_carro) {
        $scope.verificarToken();
        console.log("Entra");
        $ionicPopup.prompt({
            title: 'Introduzca el nuevo nombre',
            inputType: 'text',
            inputPlaceholder: 'Nuevo nombre'
        }).then(function (res) {
            var dataCarro = {
                "accesToken": localStorage.getItem("access_token"),
                "name": res,
                "id_carro": id_carro
            };
            var res = $http.post($scope.dominio + '/carro/editarCarro', dataCarro);
            res.success(function (data, status, headers, config) {
                //PONER MENSAJE
            });
        });
    };

    $scope.click = function (id_carro) {
        misCarrosService.id_carro = id_carro;
        $location.path("/app/productosCarro");
    }

});