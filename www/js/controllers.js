angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location) {

  $scope.closeSession = function () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        $location.path('/login');
    };
    /*
    $scope.dataVerify = {
        access_token: localStorage.getItem("access_token")
    };

    $scope.verifyToken = function () {
        var res = $http.post('http://localhost:3000/verify-token', $scope.dataVerify);
        res.success(function (data, status, headers, config) {
            localStorage.setItem("username", data.user.username);
        });
        res.error(function (data, status, headers, config) {
            if (status === 400) {
                $scope.message = "el usuario o la contraseña no son validos";
                $scope.closeSession();
            } else if (status === 402) {
                console.log("refresh_token");
                $scope.refreshToken();
            }
        });
    };

    $scope.dataRefresh = {
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token")
    };

    $scope.refreshToken = function () {
        var res = $http.post('http://localhost:3000/refresh-token', $scope.dataRefresh);
        res.success(function (data, status, headers, config) {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);

        });
        res.error(function (data, status, headers, config) {
            $scope.message = "el usuario o la contraseña no son validos";
            $location.path('/login');
        });
    };
    */
}).controller("registroCtrl", function($http, $scope,$location){

  $scope.register = {};

  var obtenerLocalidadesRegistro = function(){
    $http.get("http://localhost:3005/ObtenerTodasLocalidades")
      .then(function(response){
          $scope.localidades = response.data;
        });
};
    obtenerLocalidadesRegistro();

  $scope.doRegistro = function(){
    console.log($scope.register);
    $http.post("http://localhost:3005/usuario/insertarUsuario",$scope.register)
    .then(function(response){

        $location.path("/login");
    });
  };



})
.controller("loginCtrl", function($http, $scope,$ionicModal,$location){


    $scope.loginData = {};

    var createToken = function () {
              var res = $http.post('http://localhost:3005/token/crearToken', $scope.loginData);
              res.success(function (data, status, headers, config) {
                console.log(data);
                if(data.status == null){
                  localStorage.setItem("access_token", data.accesToken);
                  localStorage.setItem("refresh_token", data.refreshToken);
                  $location.path("/app/micarrito")
                }
              });
          };

        $scope.login = function(){
              createToken();
          }


});
