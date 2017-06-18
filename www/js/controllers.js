angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope,$state, $ionicModal, $timeout, $location, $http,$ionicPopup,$rootScope,$cordovaBarcodeScanner,filtradoService) {
        $scope.closeSession = function () {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            filtradoService.filtros.filtroActivado = false;
            filtradoService.verEliminarFiltro = false;
            $rootScope.hideLoading();
            $location.path('/login');
        };

        $scope.token = {};
        $scope.token.accesToken = localStorage.getItem("access_token");
        $scope.token.refreshToken = localStorage.getItem("refresh_token");

        $scope.carros = [];

        $scope.popupFeedback = {};

         $scope.obtenerLocalidadUsuario = function(){
          var localidad = $http.post($rootScope.dominio + '/usuario/obtenerLocalidadUsuario', $scope.token);
          localidad.success(function (data, status, headers, config) {
              $rootScope.localidadUsuario = data;
          });
          localidad.error(function (data, status, headers, config) {
            $scope.showFeedback("error","ha surguido un error en la consulta",305);
          });
        }

          $scope.obtenerLocalidadUsuario();



        $scope.showFeedback = function(title,mensaje,error){
          $rootScope.hideLoading();
          var template = mensaje;
          if(title === null || title === ""){
            title = "Error";
          }
          if(error === "alert"){
            $scope.popupFeedback = $ionicPopup.alert({
             title: title,
             template: mensaje
           });
         }else{
          if(template === null || template === ""){
            if(error === 300){
              template = '<p class="text-center">La sesion a caducado</p>';
            }else if(error = 305){
              template = '<p class="text-center">Ha surguido un error en la cosulta, se recomienda cerrar la sesion</p>';
            }
          }else{
            template = '<p class="text-center">'+mensaje+'</p>';
          }

          if(error === 305){
            $scope.popupFeedback = $ionicPopup.confirm({
             title: title,
             template: template,

           });
           $scope.popupFeedback.then(function(res){
             if(res){
                $scope.closeSession();
             }else{
               $scope.popupFeedback.close();
               $rootScope.hideLoading();
             }
           });
          }else if(error === 300){
            $scope.popupFeedback = $ionicPopup.show({
             title: title,
             template: template,
           });
           setTimeout(function(e){
              $scope.popupFeedback.close();
               $scope.closeSession();
           },1500);


          }
        }
        };



        var ajax;

        $scope.verificarToken = function () {
            ajax = $http.post($rootScope.dominio + '/token/validarToken', $scope.token);
            ajax.success(function (data, status, headers, config) {
                if (data === 300) {
                    $rootScope.hideLoading();
                    $scope.closeSession();
                } else if (data === 302) {
                    $scope.refrescarToken();
                }
            });
            ajax.error(function (data, status, headers, config) {
                    $rootScope.hideLoading();
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
                    $rootScope.hideLoading();
                    $scope.closeSession();
              }
            });

            ajax.error(function (data, status, headers, config) {
              $scope.showFeedback("Error","error en la consulta",305);
              $rootScope.hideLoading();
              $scope.closeSession();
            });
        };

        $scope.goTo = function(url){
              $location.path(url);
        }



        $scope.verificarToken();
    });
