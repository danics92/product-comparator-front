angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location,$http) {

  console.log("appCargado");



  $scope.dominio = "http://localhost:3005";

  $scope.closeSession = function () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        $scope.usuario = {};
        $location.path('/login');
    };

    $scope.token ={}
    $scope.token.accesToken = localStorage.getItem("access_token");
    $scope.token.refreshToken = localStorage.getItem("refresh_token")

    var ajax;

    $scope.verificarToken = function(){
    console.log("verificando");
      ajax = $http.post($scope.dominio + '/token/validarToken', $scope.token );
      ajax.success(function (data, status, headers, config) {
          if(data === 500){
            $scope.closeSession();
          }else if(data === 502){
            $scope.refrescarToken();
          }
      });
    }

    $scope.refrescarToken = function(){
      ajax = $http.post($scope.dominio + '/token/refrescarToken', $scope.token );
      ajax.success(function (data, status, headers, config) {
          if(data){
            localStorage.setItem("access_token", data.accesToken);
            localStorage.setItem("refresh_token", data.refreshToken);
          }else{
            $scope.closeSession();
          }
      });
    }


    $scope.verificarToken();


}).controller("registroCtrl", function($http, $scope,$location){

  $scope.register = {};

  $scope.dominio = "http://localhost:3005";

    var obtenerLocalidadesRegistro = function(){
      console.log($scope.dominio);
    var ajax =  $http.get($scope.dominio + "/ObtenerTodasLocalidades");
    ajax.success(function(data, status, headers, config){
      $scope.localidades = data;
    });
};
    obtenerLocalidadesRegistro();

  $scope.doRegistro = function(){
    var ajax =  $http.post($scope.dominio + "/usuario/insertarUsuario",$scope.register);
    ajax.success(function(data, status, headers, config){
        $location.path("/login");
    });
  };



})
.controller("loginCtrl", function($http, $scope,$ionicModal,$location){

  $scope.dominio = "http://localhost:3005";

    $scope.loginData = {};

    var createToken = function () {
              var res = $http.post($scope.dominio + '/token/crearToken', $scope.loginData);
              res.success(function (data, status, headers, config) {
                console.log(data);
                if(data.accesToken && data.refreshToken){
                  localStorage.setItem("access_token", data.accesToken);
                  localStorage.setItem("refresh_token", data.refreshToken);
                  $location.path("/app/micarrito");
                }
              });
          };

        $scope.login = function(){
              createToken();
          }
}).factory('misCarrosService',function(){

  var id_carro = 1;
  var precio = 0;

  return{
    id_carro:id_carro,
    getData:function(){
      return precio;
    },
    setData: function(dinero) {
        precio = dinero;
      }
  }

}).controller("misCarrosCtrl", function($http, $scope,$ionicModal,$location,misCarrosService){
  $scope.verificarToken();
  $scope.carros = {};


  var carros = $http.post($scope.dominio + '/usario/carros/obtenerCarrosUsuario',$scope.token);
  carros.success(function (data, status, headers, config) {
      $scope.carros = data;
      $scope.obtenerPrecioCarros();

  });



  var dinero = 0;
    var indexCarro = 0;
  $scope.obtenerPrecioCarros = function(){
    for(var i = 0; i < $scope.carros.length;i++){
      if($scope.carros[i].productos.length === 0){
        $scope.carros[i].precioCarro = 0;
      }else{
      for(var j = 0; j < $scope.carros[i].productos.length;j++){
        var res = $http.get($scope.dominio + '/productoTienda/obtenerProductoTiendaPorId?id='+$scope.carros[i].productos[j].idProductoTienda);
        res.success(function (data, status, headers, config) {
          if(data.historialPrecio.length > 0){
            dinero = dinero + data.historialPrecio[data.historialPrecio.length-1].precio;

          }
        });
      }
      misCarrosService.setData(dinero);
    }
    $scope.carros[indexCarro].precioCarro = misCarrosService.getData();
    }
    indexCarro++;
  }


    $scope.click = function(id_carro){
      misCarrosService.id_carro = id_carro;
      $location.path("/app/productosCarro");
    }

}).controller("productosCarroCtrl", function($http, $scope,$ionicModal,$location,misCarrosService){
  $scope.verificarToken();

  $scope.productosCarro = {};

  var dataProductosCarro = {
    "accesToken":  localStorage.getItem("access_token"),
    "id_carro": misCarrosService.id_carro
  }

  $scope.obtenerProductosCarro = function(){
      $scope.verificarToken();
    var res = $http.post($scope.dominio + '/carro/obtenerProductosCarro', dataProductosCarro);
    res.success(function (data, status, headers, config) {
      $scope.productosCarro = data;
      console.log($scope.productosCarro);
      //$scope.productosCarro.precio
    });
  }

  $scope.obtenerProductosCarro();
  console.log($scope.productosCarro);

}).controller("productosCtrl", function($http, $scope,$ionicModal,$location){
  $scope.verificarToken();
console.log("dentro de productosCtrl");
  $scope.productos = {}

  $scope.dominio = "http://localhost:3005";

  $scope.obtenerProductosCarro = function(){
      $scope.verificarToken();
    var res = $http.get($scope.dominio + '/producto/obtenerTodosProductos');
    res.success(function (data, status, headers, config) {
      console.log("productos:"+data);
      $scope.productos = data;
    });
  }

  $scope.obtenerProductosCarro();


}).controller("seguimientoCtrl", function($http, $scope,$ionicModal,$location){
  $scope.verificarToken();

  $scope.seguimientos = {}

  $scope.obtenerSeguimientos = function(){
      $scope.verificarToken();

    var res = $http.post($scope.dominio + '/usuario/seguimiento/ObtenerTodosLosSeguimientos',$scope.token);
    res.success(function (data, status, headers, config) {
      $scope.seguimientos = data;
      console.log($scope.seguimientos);
      var valoraciones = 0;
      var totalValoracion = 0;
      for(var x = 0; x < $scope.seguimientos.length;x++){
        if($scope.seguimientos[x].productoValoracion.length === 0){
          $scope.seguimientos[x].productoValoracion = totalValoracion;
        }else{
           for(var j = 0; j < $scope.seguimientos[x].productoValoracion.length;j++){
             valoraciones = valoraciones + $scope.seguimientos[x].productoValoracion[j].valoracion;
           }
           totalValoracion = valoraciones / $scope.seguimientos[x].productoValoracion.length;
           $scope.seguimientos[x].productoValoracion = totalValoracion;
           totalValoracion = 0;
           valoraciones = 0;
        }
      }

      var index = 0;

      for(var i = 0; i < $scope.seguimientos.length ;i++){
        var marcas = $http.get($scope.dominio + '/marca/obtenerMarcaPorId?id='+$scope.seguimientos[i].idMarca);
        marcas.success(function (data, status, headers, config) {
          $scope.seguimientos[index].idMarca = data;
          index++;
        });
      }

    });
  }

$scope.obtenerSeguimientos();


});
