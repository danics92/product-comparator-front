/**
 * Created by danilig on 15/05/17.
 */
app.controller("registroCtrl", function($rootScope,$http, $scope,$location,$ionicLoading,$ionicPopup){


    $scope.register = {};

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
        var ajax = $http.post($rootScope.dominio + "/usuario/insertarUsuario", $scope.register);
        ajax.success(function (data, status, headers, config) {
            $rootScope.hideLoading();
            $scope.popupFeedback = $ionicPopup.alert({
             title: "Correcto",
             template: "El usuario a sido registrado"
           });
            $location.path("/login");
        });

        ajax.error(function(data, status, headers, config){
          $rootScope.hideLoading();
          $scope.popupFeedback = $ionicPopup.alert({
           title: "Error",
           template: "No se ha podido introducir el usuario, compruebe que los campos son correctos"
         });
        });
    };


});
