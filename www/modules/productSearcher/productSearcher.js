/**
 * Created by danilig on 15/05/17.
*/
app.controller("productosCtrl", function($http, $scope,$ionicModal,$location,$ionicActionSheet,$timeout){

    $scope.verificarToken();

    $scope.productos = [];

    $scope.filtro = false;

    $scope.indexProducto = 0;

    $scope.carrosCompra = [];

  var obtenerPrecioMasBarato = function(productoTiendas){
      var mejorPrecio = 0;
      var precioActual = 0;
      for(var i = 0; i < productoTiendas.length; i++){
        if(productoTiendas[i].historialPrecio.length > 0){
          for(var j = 0; j <  productoTiendas[i].historialPrecio.length; j++){
            precioActual = productoTiendas[i].historialPrecio[j].precio;
            if(mejorPrecio != 0){
                mejorPrecio = precioActual < mejorPrecio ? precioActual : mejorPrecio;
              }else{
                mejorPrecio = precioActual;
              }
            }
        }
      }
      return mejorPrecio;
    };

    var obtenerValoracionTotal = function(valoraciones){
      var valoracionesUser = 0;
      for(var i = 0; i < valoraciones.length;i++){
        valoracionesUser += valoraciones[i].valoracion;
      }
      return (valoracionesUser / valoraciones.length);
    };

    var comprobarSeguimientoProducto = function(){
        var seguimientos = $http.post($scope.dominio + '/usuario/seguimiento/obtenerTodosLosSeguimientos',$scope.token);
        seguimientos.success(function (data, status, headers, config) {
          for(var i = 0; i < $scope.productos.length; i++){
              for(var j = 0; j < data.length; j++){
                  if(data[j].id == $scope.productos[i].id){
                    $scope.productos[i].seguimientoImg = "favorite";
                    $scope.productos[i].seguimiento = true;
                    break;
                  }else {
                    $scope.productos[i].seguimientoImg = "favorite_border";
                    $scope.productos[i].seguimiento = false;
                  }
              }
            }
        });
        seguimientos.error(function (data, status, headers, config) {
          $scope.showFeedback("error","ha surguido un error en la consulta");
        });
    };

    $scope.obtenerProductosCarro = function(){
        $scope.verificarToken();
        var ajaxProductos = $http.post($scope.dominio + '/producto/obtenerProductosPorLocalidad',$scope.token);

        ajaxProductos.success(function (data, status, headers, config) {
          for(var i = 0; i < data.length; i++){
            var mejorPrecio = 0;
            var valoracion = 0;
            if(data[i].productoValoracion.length > 0){
                valoracion = obtenerValoracionTotal(data[i].productoValoracion);
            }
            if(data[i].productoTiendas.length > 0){
                mejorPrecio = obtenerPrecioMasBarato(data[i].productoTiendas);
            }
            $scope.productos.push(data[i]);
            $scope.productos[i].mejorPrecio = mejorPrecio;
            $scope.productos[i].valoracionTotal = valoracion;
            mejorPrecio = 0;
            valoracion = 0;
          }
            comprobarSeguimientoProducto();
        });
        ajaxProductos.error(function (data, status, headers, config) {
            $scope.showFeedback("error","ha surguido un error en la consulta");
        });
    };

    if(!$scope.filtro){
        $scope.obtenerProductosCarro();
    }



    var hacerSeguimiento = function(id_producto,index){
        $scope.verificarToken();

        var dataSeguimiento = {
            accesToken: $scope.token.accesToken,
            id_producto: id_producto
        };

        var ajaxSeguimiento = $http.post($scope.dominio + '/usuario/seguimiento/realizarSeguimiento',dataSeguimiento);
        ajaxSeguimiento.success(function (data, status, headers, config) {
            $scope.productos[index].seguimiento = true;
            $scope.productos[index].seguimientoImg = "favorite";
        });
        ajaxSeguimiento.error(function (data, status, headers, config) {
            $scope.showFeedback("Error","ha habido un error en la consulta");
        });
    };

    var eliminarSeguimiento = function(id_producto,index){
        $scope.verificarToken();
        var dataElimarSeguimiento = {
            accesToken: $scope.token.accesToken,
            id_producto: id_producto
        };
        var ajaxEliminarSeguimiento = $http.post($scope.dominio + '/usuario/seguimiento/eliminarSeguimiento', dataElimarSeguimiento);
        ajaxEliminarSeguimiento.success(function (data, status, headers, config) {
          $scope.productos[index].seguimiento = false;
          $scope.productos[index].seguimientoImg = "favorite_border";
        });
        ajaxEliminarSeguimiento.error(function (data, status, headers, config) {
          $scope.showFeedback("Error","ha habido un error en la consulta");
        });
    }

    var obtenerTiendasDeProducto = function(index){
      $scope.verificarToken();
        var id_tiendas = [];
        for(var i = 0; i < $scope.productos[index].productoTiendas.length; i++){
          id_tiendas.push($scope.productos[index].productoTiendas[i].idTienda);
        }
        var tiendas = $http.get($scope.dominio + '/productoTienda/obtenerTiendasPorProductos?id_tiendas='+id_tiendas);
        tiendas.success(function (data, status, headers, config) {
          $scope.productos[index].productoTiendas.tiendas = data;
        });
        tiendas.error(function (data, status, headers, config) {
          $scope.showFeedback("error","ha surguido un error en la consulta");
        });
    };

    $scope.seguimientoManager = function(id_producto,index){
        if(!$scope.productos[index].seguimiento){
            hacerSeguimiento(id_producto,index);
        }else {
            eliminarSeguimiento(id_producto,index);
        }
    };

    $scope.anadirProductoACarro = function(id_carro){

      $scope.verificarToken();

      var dataAnadirProducto = {
        accesToken: $scope.token.accesToken,
        id_carro:id_carro,
        idProductoTienda: $scope.idProductoTienda
      }

        var productoAnadido = $http.post($scope.dominio + '/usuario/carro/anadirProductoACarro',dataAnadirProducto);
        productoAnadido.success(function (data, status, headers, config) {
          console.log(data);
        });
        productoAnadido.error(function (data, status, headers, config) {
          $scope.showFeedback("error","ha surguido un error en la consulta");
        });
    }

    var obtenerCarrosCompra = function(){
    };

  $scope.openModal = function(index) {

    obtenerTiendasDeProducto(index);

    $ionicModal.fromTemplateUrl('modules/productSearcher/productModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  };



  $scope.closeModal = function() {
    $scope.modal.hide();

  };

  $scope.openCarroModal = function(idProductoTienda) {
    $scope.idProductoTienda = idProductoTienda;
    $ionicModal.fromTemplateUrl('modules/productSearcher/carrosModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalCarro = modal;
        $scope.modalCarro.show();
      });
  };

  $scope.closeCarroModal = function() {
    $scope.modalCarro.hide();

  };



});
