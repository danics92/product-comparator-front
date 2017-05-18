/**
 * Created by danilig on 15/05/17.
 */
app.factory('misCarrosService', function () {

    var id_carro = 1;

    return {
        id_carro: id_carro
    }

});

app.controller("misCarrosCtrl", function ($http, $scope, $ionicModal, $location, misCarrosService, $ionicPopup) {
    $scope.verificarToken();

    $scope.carros = {};

    var dataNuevoCarro = {};
    var dataEliminarCarro = {};
    var dataEditarCarro = {};
    var dinero = 0;
    var indexCarro = 0

    $scope.obtenerCarrosUsuario = function(){
          $scope.verificarToken();
          var carros = $http.post($scope.dominio + '/usario/carros/obtenerCarrosUsuario', $scope.token);
          carros.success(function (data, status, headers, config) {
            console.log(data);
              $scope.carros = data;
              $scope.obtenerPrecioCarros();
              $scope.carros.reverse();
          });
          carros.error(function (data, status, headers, config) {
                $scope.closeSession();
          });
    };

    $scope.popupNuevoCarro = function(){
      $ionicPopup.prompt({
          title: 'Introduzca el nombre del carro',
          inputType: 'text',
          inputPlaceholder: 'Nuevo nombre'
      }).then(function (nombre) {
          if(nombre != undefined){
            dataNuevoCarro.accesToken = $scope.token.accesToken;
            dataNuevoCarro.nombre = nombre;
            $scope.addCart();
          }
      });
    }


    $scope.addCart = function () {
          $scope.verificarToken();
            var nuevoCarro = $http.post($scope.dominio + '/usuario/carro/anadirCarroUsuario', dataNuevoCarro);
            nuevoCarro.success(function (data, status, headers, config) {
                console.log("carro añadido");
                console.log(data);
                $scope.carros.push(data);
                $scope.obtenerPrecioCarros();
                $scope.carros.reverse();
                $scope.showFeedback("correcto","se ha introducido un nuevo carro");

            });
            nuevoCarro.error(function (data, status, headers, config) {
                $scope.closeSession();
            });
    };

    $scope.popupEditarCarro = function(oldName,id_carro,index){
      $ionicPopup.prompt({
          title: 'Modificar carro',
          inputType: 'text',
          inputPlaceholder: oldName
      }).then(function (nombre) {
          if(nombre != undefined){
            dataEditarCarro.accesToken = $scope.token.accesToken;
            dataEditarCarro.nombre = nombre;
            dataEditarCarro.id_carro = id_carro;
            $scope.editCart(index,nombre);
          }
      });
    }

    $scope.editCart = function (index,nombre) {
        $scope.verificarToken();
            var editarCarro = $http.post($scope.dominio + '/usuario/carro/editarCarroUsuario', dataEditarCarro);
            editarCarro.success(function (data, status, headers, config) {
                $scope.carros[index].nombre = nombre;
                $scope.showFeedback("correcto","carro editado con exito");
            });
            editarCarro.error(function (data, status, headers, config) {
                  $scope.closeSession();
            });
    };


        $scope.deleteCarro = function (id_carro,index) {
            $scope.verificarToken();
            dataEliminarCarro = {
                "accesToken": $scope.token.accesToken,
                "id_carro": id_carro
            };
            var deleteCarro = $http.post($scope.dominio + '/usuario/carro/eliminarCarroUsuario', dataEliminarCarro);
            deleteCarro.success(function (data, status, headers, config) {
              $scope.carros.splice(index,1);
              $scope.showFeedback("correcto","carro eliminado con exito");
            });
            deleteCarro.error(function (data, status, headers, config) {
                $scope.closeSession();
            });
        };

    $scope.obtenerPrecioCarros = function () {
        for (var i = 0; i < $scope.carros.length; i++) {
            if ($scope.carros[i].productos.length === 0  || $scope.carros[i].productos == null) {
                $scope.carros[i].precioCarro = 0;
            } else {
                $scope.carros[indexCarro].precioCarro = 0;
                for (var j = 0; j < $scope.carros[i].productos.length; j++) {
                    var precios = $http.get($scope.dominio + '/productoTienda/obtenerProductoTiendaPorId?id=' + $scope.carros[i].productos[j].idProductoTienda);
                    precios.success(function (data, status, headers, config) {
                        if (data.historialPrecio.length > 0) {
                            $scope.carros[indexCarro].precioCarro = $scope.carros[indexCarro].precioCarro + data.historialPrecio[data.historialPrecio.length - 1].precio;
                        }
                    });
                    precios.error(function (data, status, headers, config) {
                          $scope.closeSession();
                    });
                }

            }

        }
    };


    $scope.click = function (id_carro) {
        misCarrosService.id_carro = id_carro;
        $location.path("/app/productosCarro");
    }

    $scope.obtenerCarrosUsuario();

});