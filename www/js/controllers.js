angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $location, $http,$ionicPopup) {


        $scope.dominio = "http://localhost:3005";

        $scope.closeSession = function () {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token")
            $location.path('/login');
        };

        $scope.token = {};
        $scope.token.accesToken = localStorage.getItem("access_token");
        $scope.token.refreshToken = localStorage.getItem("refresh_token");

        $scope.carros = [];

        $scope.showFeedback = function(title,mensaje){
          var popupFeedback = $ionicPopup.alert({
            title: title,
            template: mensaje
          });
        };



        var ajax;

        $scope.verificarToken = function () {
            console.log("verificando");
            ajax = $http.post($scope.dominio + '/token/validarToken', $scope.token);
            ajax.success(function (data, status, headers, config) {
                if (data === 300) {
                    $scope.closeSession();
                } else if (data === 302) {
                    $scope.refrescarToken();
                }
            });
            ajax.error(function (data, status, headers, config) {
                    $scope.showFeedback("Error","error en la consulta");
                    $scope.closeSession();
            });
        };

        $scope.refrescarToken = function () {
            ajax = $http.post($scope.dominio + '/token/refrescarToken', $scope.token);
            ajax.success(function (data, status, headers, config) {
                if (data) {
                    localStorage.setItem("access_token", data.accesToken);
                    localStorage.setItem("refresh_token", data.refreshToken);
                } else {
                    $scope.closeSession();
              }
            });
            ajax.error(function (data, status, headers, config) {
              $scope.showFeedback("Error","error en la consulta");
              $scope.closeSession();
            });
        };

        $scope.obtenerCarrosUsuario = function(){
              $scope.verificarToken();
              var carros = $http.post($scope.dominio + '/usario/carros/obtenerCarrosUsuario', $scope.token);
              carros.success(function (data, status, headers, config) {
                  $scope.carros = data;
                  $scope.obtenerPrecioCarros();
                  $scope.carros.reverse();
              });
              carros.error(function (data, status, headers, config) {
                $scope.showFeedback("error","ha surguido un error en la consulta");
              });
        };

        $scope.obtenerPrecioCarros = function () {
            for (var i = 0; i < $scope.carros.length; i++) {
                if ($scope.carros[i].productos.length === 0  || $scope.carros[i].productos == null) {
                    $scope.carros[i].precioCarro = 0;
                } else {
                    $scope.carros[i].precioCarro = 0;
                    for (var j = 0; j < $scope.carros[i].productos.length; j++) {
                        var precios = $http.get($scope.dominio + '/productoTienda/obtenerProductoTiendaPorId?id=' + $scope.carros[i].productos[j].idProductoTienda);
                        precios.success(function (data, status, headers, config) {
                            if (data.historialPrecio.length > 0) {
                                $scope.carros[i].precioCarro = $scope.carros[i].precioCarro + data.historialPrecio[data.historialPrecio.length - 1].precio;
                            }
                        });
                        precios.error(function (data, status, headers, config) {
                          $scope.showFeedback("error","ha surguido un error en la consulta");
                        });
                    }

                }

            }
        };

        $scope.obtenerCarrosUsuario();

        $scope.verificarToken();
    });
