/**
 * Created by danilig on 15/05/17.
 */
app.controller("seguimientoCtrl", function ($rootScope, $http, $scope, $ionicModal, $location) {
    $scope.verificarToken();

    $scope.seguimientos = [];

    $scope.productos = [];

    $scope.productoTiendas = [];

    $scope.tiendas = [];

    $scope.indexProducto = 0;

    $scope.obtenerSeguimientos = function () {
        $scope.verificarToken();
        $rootScope.showLoading();
        var res = $http.post($rootScope.dominio + '/usuario/seguimiento/obtenerTodosLosSeguimientos',$scope.token);
        res.success(function (data, status, headers, config) {
          $scope.seguimientos = data;
          obtenerProductosPorId();
        });
        res.error(function (data, status, headers, config) {
          $scope.showFeedback("Error","ha habido un error en la consulta",305);
        });
};
    $scope.obtenerSeguimientos();

    $scope.eliminarSeguimiento = function(id_producto,index){
        $scope.verificarToken();
        var dataElimarSeguimiento = {
            accesToken: $scope.token.accesToken,
            id_producto: id_producto
        };
        var ajaxEliminarSeguimiento = $http.post($rootScope.dominio + '/usuario/seguimiento/eliminarSeguimiento', dataElimarSeguimiento);
        ajaxEliminarSeguimiento.success(function (data, status, headers, config) {
          $scope.productos.splice(index,1);
        });
        ajaxEliminarSeguimiento.error(function (data, status, headers, config) {
          console.log(data);
          $scope.showFeedback("Error","ha habido un error en la consulta",305);
        });
    }

    var obtenerTiendasPorIds = function(index){
      var old = 0;
      var parameters = "";
      for(var i = 0; i < $scope.productos[index].productoTiendas.length; i++){
        if(i === 0){
          old = $scope.productos[index].productoTiendas[i].idTienda;
          parameters += $scope.productos[index].productoTiendas[i].idTienda;
        }else{
          if(old != $scope.productos[index].productoTiendas[i].idTienda ){
              parameters += "&id_tiendas="+$scope.productos[index].productoTiendas[i].idTienda;
              old = $scope.productos[index].productoTiendas[i].idTienda;
          }
        }
      }


      var tiendasPorId = $http.get($rootScope.dominio + '/tienda/obtenerTiendasPorIds?id_tiendas='+parameters);

      tiendasPorId.success(function (data, status, headers, config) {
        console.log(data);
        for(var j = 0; j < data.length; j++){
          $scope.productos[index].productoTiendas[j].tienda = data[j];
          if(  $scope.productos[index].productoTiendas[j].historialPrecio.length == 0){
            $scope.productos[index].productoTiendas[j].precio = 0;
          }else{
              $scope.productos[index].productoTiendas[j].precio =   $scope.productos[index].productoTiendas[j].historialPrecio[0].precio;
          }
        }
        $rootScope.hideLoading();
      });
      tiendasPorId.error(function (data, status, headers, config) {
        $scope.showFeedback("Error","ha habido un error en la consulta",305);
        $rootScope.hideLoading();

      });
    }

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

      var obtenerProductosPorId = function(){
        var parameters = "?id_producto=";
        var oldProducto = 0;
        var numProductos = 0;
        for(var i = 0; i < $scope.seguimientos.length; i++){
          if($scope.seguimientos.length == 1 || i == 0){
            parameters += $scope.seguimientos[i].idProducto;
          }else{
            parameters += "&id_producto="+$scope.seguimientos[i].idProducto;;
          }
          numProductos++;
        }
        if($scope.seguimientos.length > 0){
          var obtenerProductos;
        if(numProductos >= 1){
          obtenerProductos = $http.get($rootScope.dominio + '/producto/obtenerProductoIds'+parameters);
        }else{
          obtenerProductos = $http.get($rootScope.dominio + '/producto/obtenerProducto'+parameters);
        }


        obtenerProductos.success(function (data, status, headers, config) {
            $scope.productos = data;
            $rootScope.hideLoading();
        });
        obtenerProductos.error(function (data, status, headers, config) {
          $scope.showFeedback("Error","ha habido un error en la consulta",305);
          $rootScope.hideLoading();
        });
      }
      $rootScope.hideLoading();
      }

      $scope.openModal = function(index){
        $scope.indexProducto = index;
        obtenerTiendasPorIds(index);
        $ionicModal.fromTemplateUrl('modules/follow/seguimientoModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
      }


        $scope.closeModal = function() {
          $scope.modal.hide();
          $scope.modal.remove();

        };



});
