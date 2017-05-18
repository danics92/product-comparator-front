/**
 * Created by danilig on 15/05/17.
 */
app.controller("productosCtrl", function($http, $scope,$ionicModal,$location){

    $scope.verificarToken();

    $scope.productos = [];

    $scope.favorite = false;
    $scope.favoriteImg = "favorite_border";

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


    $scope.obtenerProductosCarro = function(){
        $scope.verificarToken();
        var ajaxProductos = $http.post($scope.dominio + '/producto/obtenerProductosPorLocalidad',$scope.token);

        ajaxProductos.success(function (data, status, headers, config) {
          console.log(data);
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

        });
        ajaxProductos.error(function (data, status, headers, config) {
            $scope.showFeedback("error","ha surguido un error en la consulta");
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
