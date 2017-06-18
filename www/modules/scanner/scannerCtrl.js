/**
 * Created by danilig on 15/05/17.
 */
app.controller("scannerCtrl", function ($scope, $cordovaBarcodeScanner, $ionicPlatform, $rootScope, $http, $ionicModal) {

    $scope.productos = [];

    $scope.carros = [];

    $scope.code = "";

    $scope.indexProducto = 0;


    var obtenerTiendasDeProducto = function () {
        $scope.verificarToken();
        var id_tiendas = [];
        for (var i = 0; i < $scope.productos[0].productoTiendas.length; i++) {
            if ($scope.productos[0].productoTiendas[i].historialPrecio == undefined || $scope.productos[0].productoTiendas[i].historialPrecio.length <= 0) {
                $scope.productos[0].productoTiendas[i].historialPrecio.precio = 0;
            } else {
                $scope.productos[0].productoTiendas[i].historialPrecio.precio = $scope.productos[0].productoTiendas[i].historialPrecio[0].precio;
            }
            id_tiendas.push($scope.productos[0].productoTiendas[i].idTienda);
        }
        var tiendas = $http.get($rootScope.dominio + '/tienda/obtenerTiendasPorIds?id_tiendas=' + id_tiendas);
        tiendas.success(function (data, status, headers, config) {
            $scope.productos[0].productoTiendas.tiendas = [];
            if ($rootScope.localidadUsuario == 0) {
                $scope.obtenerLocalidadUsuario();
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].idLocalidad == $rootScope.localidadUsuario) {
                    $scope.productos[0].productoTiendas.tiendas.push(data[i]);
                }
            }
            $scope.openModal();

        });
        tiendas.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });
    }

    var obtenerValoracionTotal = function (valoraciones) {
        var valoracionesUser = 0;
        for (var i = 0; i < valoraciones.length; i++) {
            valoracionesUser += valoraciones[i].valoracion;
        }
        return (valoracionesUser / valoraciones.length);
    };


    $scope.obtenerCarrosUsuario = function () {
        $scope.verificarToken();
        var carros = $http.post($rootScope.dominio + '/usario/carros/obtenerCarrosUsuario', $scope.token);
        carros.success(function (data, status, headers, config) {
            $scope.carros = data;
            $scope.obtenerPrecioCarros();
        });
        carros.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });
    };

    $scope.obtenerPrecioCarros = function () {

        var id_carros = [];

        for (var i = 0; i < $scope.carros.length; i++) {
            id_carros.push($scope.carros[i].id)
        }

        var dataCarros = {
            accesToken: $scope.token.accesToken,
            carros: id_carros
        }

        var precios = $http.post($rootScope.dominio + '/carro/obtenerPreciosCarro', dataCarros);
        precios.success(function (data, status, headers, config) {
            for (var i = 0; i < $scope.carros.length; i++) {
                $scope.carros[i].precioTotal = data[i];
            }
            $scope.carros.reverse();
        });
        precios.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });

    }



    $scope.scanBarcode = function () {
      $scope.verificarToken();
        $ionicPlatform.ready(function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (result.text != "" && result.text != null) {
                      var producto = $http.get($rootScope.dominio + '/producto/obtenerProductoPorCode?code=' + result.text);
                      producto.success(function (data, status, headers, config) {
                        if(data != null && data != undefined && data != ""){
                          $scope.productos.push(data);
                          if (data.productoValoracion.length > 0) {
                              $scope.productos[0].valoracionTotal = obtenerValoracionTotal(data.productoValoracion);
                          } else {
                              $scope.productos[0].valoracionTotal = 0;
                          }
                          obtenerTiendasDeProducto();
                        }else{
                          alert("El producto con codigo de barras "+result.text+" no existe en la base de datos");
                        }
                      });
                      producto.error(function (data, status, headers, config) {
                          $scope.showFeedback("error", "ha surguido un error en la consulta",305);
                      });
                  }
                  },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        });
    }

    $scope.openModal = function () {
        $ionicModal.fromTemplateUrl('modules/productSearcher/productModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };


    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove();
        $scope.productos = [];
        $scope.carros = [];
    };


    $scope.openCarroModal = function (idProductoTienda) {
        $scope.obtenerCarrosUsuario();
        $scope.idProductoTienda = idProductoTienda;
        $ionicModal.fromTemplateUrl('modules/productSearcher/carrosModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalCarro = modal;
            $scope.modalCarro.show();
        });
    };

    $scope.closeCarroModal = function () {
        $scope.modalCarro.hide();
        $scope.modalCarro.remove();
    };


});
