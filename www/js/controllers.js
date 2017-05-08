angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location,$http) {

  console.log("appCargado");



  $scope.dominio = "http://localhost:3005";

  $scope.usuario = {};

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
          }else{
            $scope.obtenerUsuario();
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

    $scope.obtenerUsuario = function(){
      console.log("obtenerUsuario");
      ajax = $http.post($scope.dominio + '/usuario/obtenerUsuario', $scope.token );
      ajax.success(function (data, status, headers, config) {
        console.log(data);
        $scope.usuario = data;
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

  return{
    id_carro:id_carro
  }

}).controller("misCarrosCtrl", function($http, $scope,$ionicModal,$location,misCarrosService){
    $scope.verificarToken();
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


});


;
