/**
 * Created by danilig on 15/05/17.
 */
app.controller("misCarrosCtrl", function ($rootScope, $http, $scope, $ionicModal, $location, $ionicPopup, $ionicLoading) {

    var dataNuevoCarro = {};
    var dataEliminarCarro = {};
    var dataEditarCarro = {};
    var dinero = 0;

    $scope.productoTiendas = {};

    $scope.productos = {};

    $scope.multiplicador = [];

    $scope.index_carro = 0;


    $rootScope.showLoading();

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
            $rootScope.hideLoading();
        });
        precios.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "error en carros",305);
        });

    }



    $scope.popupNuevoCarro = function(){
      $scope.data = {};
      $ionicPopup.show({
        template: '<input type="text" ng-model="data.email">',
          title: 'Añadir carro',
          inputType: 'text',
          scope:$scope,
          buttons: [
            {text:'Cancel',onTap: function(e){ return true;}},
            {
              text:'<b>Guardar</b>',
              type:'button-positive',
              onTap:function(e){
                if($scope.data.email != undefined && $scope.data.email != ""){
                  dataNuevoCarro.accesToken = $scope.token.accesToken;
                  dataNuevoCarro.nombre = $scope.data.email;
                  $scope.addCart();
                }else{
                  $scope.showFeedback("error","El campo no puede estar vacio","alert");
                }
              }
            }
          ]
      });
      /*$ionicPopup.prompt({
          title: 'Introduzca el nombre del carro',
          inputType: 'text',
          inputPlaceholder: 'Nuevo nombre'
      }).then(function (nombre) {
          if(nombre != undefined && nombre != ""){

          }else{
              $scope.showFeedback("error","El nombre no puede estar vacio","alert");
          }
      });
      */
    }


    $scope.addCart = function () {
        $scope.verificarToken();
        var nuevoCarro = $http.post($rootScope.dominio + '/usuario/carro/anadirCarroUsuario', dataNuevoCarro);
        nuevoCarro.success(function (data, status, headers, config) {
            $scope.carros.push(data);
            $scope.obtenerPrecioCarros();
            $scope.showFeedback("correcto", "se ha introducido un nuevo carro");

        });
        nuevoCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });
        $scope.carros.reverse();
    };



    $scope.popupEditarCarro = function(oldName,id_carro,index){
  $scope.data = {};
      $ionicPopup.show({
        template: '<input type="text" ng-model="data.email">',
          title: 'Modificar carro',
          inputType: 'text',
          inputPlaceholder: oldName,
          scope:$scope,
          buttons: [
            {text:'Cancel',onTap: function(e){ return true;}},
            {
              text:'<b>Guardar</b>',
              type:'button-positive',
              onTap:function(e){
                if($scope.data.email != undefined && $scope.data.email != ""){
                  dataEditarCarro.accesToken = $scope.token.accesToken;
                  dataEditarCarro.nombre = $scope.data.email;
                  dataEditarCarro.id_carro = id_carro;
                  $scope.editCart(index,$scope.data.email);
                }else{
                  $scope.showFeedback("error","El campo no puede estar vacio","alert");
                }
              }
            }
          ]
      });
    }

    $scope.editCart = function (index, nombre) {
        $scope.verificarToken();
            var editarCarro = $http.post($rootScope.dominio + '/usuario/carro/editarCarroUsuario', dataEditarCarro);
            editarCarro.success(function (data, status, headers, config) {
                $scope.carros[index].nombre = nombre;
                $scope.showFeedback("correcto","carro editado con exito");
            });
            editarCarro.error(function (data, status, headers, config) {
              $scope.showFeedback("error","ha surguido un error en la consulta",305);
            });
    };


    $scope.deleteCarro = function (id_carro, index) {
        $scope.verificarToken();
        dataEliminarCarro = {
            "accesToken": $scope.token.accesToken,
            "id_carro": id_carro
        };
        var deleteCarro = $http.post($rootScope.dominio + '/usuario/carro/eliminarCarroUsuario', dataEliminarCarro);
        deleteCarro.success(function (data, status, headers, config) {
            $scope.carros.splice(index, 1);
        });
        deleteCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });
    };

    $scope.obtenerCarrosUsuario();


    //////////Modal Productos carro ////////
    $scope.productosCarro = [];

    var obtenerProductosCarro = function (id_carro) {
        $scope.verificarToken();
        var dataProductosCarro = {
            "accesToken": $scope.token.accesToken,
            "id_carro": id_carro
        };
        var productosCarro = $http.post($rootScope.dominio + '/usuario/carro/obtenerProductosCarro', dataProductosCarro);
        productosCarro.success(function (data, status, headers, config) {
            $scope.productosCarro = data;
            obtenerProductoTienda();
        });
        productosCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });
    };

    $scope.eliminarProducto = function (index_producto, id_producto) {
        $scope.verificarToken();
        dataProductoEliminar = {
            "accesToken": $scope.token.accesToken,
            "id_carro": $scope.id_carro_modal,
            "id_producto_carro": id_producto
        };
        var eliminarProducto = $http.post($rootScope.dominio + '/usuario/carro/eliminarProductoCarro', dataProductoEliminar);
        eliminarProducto.success(function (data, status, headers, config) {
            $scope.productosCarro.splice(index_producto, 1);
            $scope.carros[$scope.index_carro].precioTotal -= data;
        });
        eliminarProducto.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta",305);
        });
    };

    var obtenerProductoTienda = function(){
      $scope.verificarToken();
      var parametros = "";
      var old = 0;
      if($scope.productosCarro.length > 0){
      for(var i = 0; i < $scope.productosCarro.length; i++){
          if(i == 0){
            parametros += $scope.productosCarro[i].idProductoTienda;
            old = $scope.productosCarro[i].idProductoTienda;
          }else{
            if(old != $scope.productosCarro[i].idProductoTienda){
                parametros += ","+$scope.productosCarro[i].idProductoTienda;
                old = $scope.productosCarro[i].idProductoTienda;
            }
          }
      }
      var ajaxProductoTienda = $http.get($rootScope.dominio + '/productoTienda/obtenerListaProductoTiendasPorId?id_productosTiendas='+parametros);
      ajaxProductoTienda.success(function (data, status, headers, config) {
          $scope.productoTiendas = data;
          obtenerInformacionProductos();
      });
      ajaxProductoTienda.error(function (data, status, headers, config) {
          $scope.showFeedback("error", "ha surguido un error en la consulta",305);
      });
    }
    }

    var obtenerInformacionProductos = function(){
      $scope.verificarToken();
      var parametros = "";
      var old = 0;
      for(var i = 0; i < $scope.productoTiendas.length; i++){
        if(i == 0){
          parametros += $scope.productoTiendas[i].idProducto;
          old = $scope.productoTiendas[i].idProducto;
        }else{
          if(old != $scope.productoTiendas[i].idProducto){
              parametros += ","+$scope.productoTiendas[i].idProducto;
              old = $scope.productoTiendas[i].idProducto;
          }
        }
      }
      var ajaxProductoTienda = $http.get($rootScope.dominio + '/producto/obtenerProductoIds?id_producto='+parametros);
      ajaxProductoTienda.success(function (data, status, headers, config) {
          $scope.productos = data;
          var productoFormatado = false;
          for(var i = 0; i < $scope.productosCarro.length;i++){
            for(var x  =0; x < $scope.productos.length; x++){
              for(var j = 0; j < $scope.productos[x].productoTiendas.length;j++){
                if($scope.productos[x].productoTiendas[j].id == $scope.productosCarro[i].idProductoTienda){
                    $scope.productosCarro[i].nombre = $scope.productos[x].nombre;
                    $scope.productosCarro[i].precio = $scope.productos[x].productoTiendas[j].historialPrecio[0].precio;
                    productoFormatado = true;
                    break;
                }
              }
              if(productoFormatado){
                productoFormatado = false;
                break;
              }
            }
          }
      });
      ajaxProductoTienda.error(function (data, status, headers, config) {
          $scope.showFeedback("error", "ha surguido un error en la consulta",305);
      });
    }


    $scope.openModal = function (id_carro, index_carro) {
        $rootScope.showLoading();
        $scope.id_carro_modal = id_carro;
        $scope.index_carro = index_carro;
        obtenerProductosCarro(id_carro);
        $ionicModal.fromTemplateUrl('modules/myCart/productosCarroModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $rootScope.hideLoading();
        });
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove();
    };

});
