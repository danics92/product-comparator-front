/**
 * Created by danilig on 15/05/17.
 */

app.controller("loginCtrl", function ($rootScope,$ionicPopup, $http, $scope, $ionicModal, $location, $ionicLoading) {


        $scope.loginData = {};
        console.log($rootScope.dominio);
        var createToken = function () {
            var res = $http.post($rootScope.dominio + '/token/crearToken', $scope.loginData);
            res.success(function (data, status, headers, config) {
                if (data.accesToken && data.refreshToken) {
                    localStorage.setItem("access_token", data.accesToken);
                    localStorage.setItem("refresh_token", data.refreshToken);

                }
                  $location.path("/app/productos");
            });
            res.error(function (data, status, headers, config) {
              $scope.popupFeedback = $ionicPopup.alert({
               title: "Error",
               template: "ha surguido un error en la consulta"
             });
            });
        }


    $scope.login = function () {
        $rootScope.showLoading();
        createToken();
        $rootScope.hideLoading();
    }

});
