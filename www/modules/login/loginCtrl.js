/**
 * Created by danilig on 15/05/17.
 */
(function () {
    'use strict';
    app.controller("loginCtrl", function ($http, $scope, $ionicModal, $location) {

        $scope.dominio = "http://localhost:3005";

      //  $scope.dominio = "http://192.168.38.40:3005";

        $scope.loginData = {};

        var createToken = function () {
            var res = $http.post($scope.dominio + '/token/crearToken', $scope.loginData);
            res.success(function (data, status, headers, config) {
                console.log(data);
                if (data.accesToken && data.refreshToken) {
                    localStorage.setItem("access_token", data.accesToken);
                    localStorage.setItem("refresh_token", data.refreshToken);
                    $location.path("/app/micarrito");
                }
            });
        };

        $scope.login = function () {
            createToken();
        }
    });
})();
