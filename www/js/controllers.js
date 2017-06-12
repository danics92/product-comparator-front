angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $location, $http,$ionicPopup,$rootScope) {
        $scope.closeSession = function () {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token")
            $location.path('/login');
        };

        $scope.token = {};
        $scope.token.accesToken = localStorage.getItem("access_token");
        $scope.token.refreshToken = localStorage.getItem("refresh_token");

        $scope.carros = [];

         $scope.obtenerLocalidadUsuario = function(){
          var localidad = $http.post($rootScope.dominio + '/usuario/obtenerLocalidadUsuario', $scope.token);
          localidad.success(function (data, status, headers, config) {
              $rootScope.localidadUsuario = data;
          });
          localidad.error(function (data, status, headers, config) {
            $scope.showFeedback("error","ha surguido un error en la consulta");
          });
        }

        if( $rootScope.localidadUsuario == 0){
          $scope.obtenerLocalidadUsuario();
        }



        $scope.showFeedback = function(title,mensaje){
          var popupFeedback = $ionicPopup.alert({
            title: title,
            template: mensaje
          });
        };



        var ajax;

        $scope.verificarToken = function () {
            console.log("verificando");
            ajax = $http.post($rootScope.dominio + '/token/validarToken', $scope.token);
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
            ajax = $http.post($rootScope.dominio + '/token/refrescarToken', $scope.token);
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

        $scope.goTo = function(url){
          $location.path(url);
        }

    


        $scope.verificarToken();
    });
