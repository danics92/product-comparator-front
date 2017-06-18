/**
 * Created by danilig on 15/05/17.
 */

app.controller("loginCtrl", function ($rootScope,$ionicPopup, $http, $scope, $ionicModal, $location, $ionicLoading) {




        $scope.loginData = {};

        var createToken = function () {
              $scope.errorLogin = false;
            if($scope.loginData.email == "" || $scope.loginData.email == null || $scope.loginData.email == undefined){
              $scope.emailVacio = true;
                  return false;
            }else if($scope.loginData.password == "" || $scope.loginData.password == null || $scope.loginData.password == undefined ){
              $scope.passwordVacio = true;
                  return false;
            }

            var res = $http.post($rootScope.dominio + '/token/crearToken', $scope.loginData);
            res.success(function (data, status, headers, config) {
                if (data.accesToken && data.refreshToken) {
                    localStorage.setItem("access_token", data.accesToken);
                    localStorage.setItem("refresh_token", data.refreshToken);
                    $location.path("/app/productos");
                }else{
                  $scope.popupFeedback = $ionicPopup.alert({
                   title: "Error",
                   template: "El email o la contraseña no son correctos"
                 });
                 $scopepe.popupFeedback.show();
                }

            });
            res.error(function (data, status, headers, config) {
              $scope.popupFeedback = $ionicPopup.alert({
               title: "Error",
               template: "ha surguido un error en la consulta"
             });
              $scopepe.popupFeedback.show();
            });
        }


    $scope.login = function () {
        $rootScope.showLoading();
        createToken();
        $rootScope.hideLoading();
    }

});
