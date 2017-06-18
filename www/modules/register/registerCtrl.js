/**
 * Created by danilig on 15/05/17.
 */
app.controller("registroCtrl", function($rootScope,$http, $scope,$location,$ionicLoading,$ionicPopup){


    $scope.register = {};

    $scope.errorEmailRegistro = false;
    $scope.errorTelefonoRegistro = false;
    $scope.errorPasswordRegistro = false;
    $scope.errorLocalidadRegistro = false;

    document.getElementById('localidad').value = 43;

    var obtenerLocalidadesRegistro = function () {
        $rootScope.showLoading();
        var ajax = $http.get($rootScope.dominio + "/localidad/obtenerTodasLocalidades");
        ajax.success(function (data, status, headers, config) {
            $scope.localidades = data;

            $rootScope.hideLoading();
        });

        ajax.error(function (data, status, headers, config) {
            $rootScope.hideLoading();
            $scope.popupFeedback = $ionicPopup.alert({
             title: "Error",
             template: "ha surguido un error en la consulta"
           });
        });
    };
    obtenerLocalidadesRegistro();

    $scope.doRegistro = function () {
        $rootScope.showLoading();
      $scope.errorTelefonoRegistro = false;
      $scope.errorPasswordRegistro = false;
      $scope.errorEmailRegistro = false;
      $scope.errorLocalidadRegistro = false;
      if(isNaN($scope.register.telefono)){
          $scope.errorTelefonoRegistro = true;
      }
      if($scope.register.password == "" || $scope.register.password == null || $scope.register.password == undefined){
          $scope.errorPasswordRegistro = true;
      }
      if($scope.register.email == "" || $scope.register.email == null || $scope.register.email == undefined){
          $scope.errorEmailRegistro = true;
      }
      if($scope.register.localidad == "" || $scope.register.localidad == null || $scope.register.localidad == undefined){
          $scope.errorLocalidadRegistro = true;
      }
      if($scope.errorTelefonoRegistro || $scope.errorEmailRegistro || $scope.errorPasswordRegistro || $scope.errorLocalidadRegistro){
          $rootScope.hideLoading();
        return null;
      }


        var ajax = $http.post($rootScope.dominio + "/usuario/insertarUsuario", $scope.register);
        ajax.success(function (data, status, headers, config) {
            $rootScope.hideLoading();
            if(data.status == 202){
                  $scope.errorEmailRegistro = true;
            }else if(data != null && data != undefined && data != ""){
              $scope.popupFeedback = $ionicPopup.alert({
               title: "Correcto",
               template: "El usuario a sido registrado"
             });
              $location.path("/login");
            }

        });

        ajax.error(function(data, status, headers, config){
          $rootScope.hideLoading();
          $scope.popupFeedback = $ionicPopup.alert({
           title: "Error",
           template: "No se ha podido introducir el usuario, compruebe que los campos son correctos"
         });
        });
    };

    $scope.goTo = function(url){
          $location.path(url);
    }



});
