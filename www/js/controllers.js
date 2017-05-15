angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $location, $http) {


        $scope.dominio = "http://192.168.1.36:3005";

        $scope.closeSession = function () {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            $scope.usuario = {};
            $location.path('/login');
        };

        $scope.token = {};
        $scope.token.accesToken = localStorage.getItem("access_token");
        $scope.token.refreshToken = localStorage.getItem("refresh_token")

        var ajax;

        $scope.verificarToken = function () {
            console.log("verificando");
            ajax = $http.post($scope.dominio + '/token/validarToken', $scope.token);
            ajax.success(function (data, status, headers, config) {
                if (data === 500) {
                    $scope.closeSession();
                } else if (data === 502) {
                    $scope.refrescarToken();
                }
            });
        };

        $scope.refrescarToken = function () {
            ajax = $http.post($scope.dominio + '/token/refrescarToken', $scope.token);
            ajax.success(function (data, status, headers, config) {
                if (data) {
                    localStorage.setItem("access_token", data.accesToken);
                    localStorage.setItem("refresh_token", data.refreshToken);
                } else {
                    $scope.closeSession();
                }
            });
        };

        $scope.verificarToken();
    });
