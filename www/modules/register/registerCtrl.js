/**
 * Created by danilig on 15/05/17.
 */
app.controller("registroCtrl", function($http, $scope,$location){

    $scope.register = {};

    $scope.dominio = "http://localhost:3005";
    //$scope.dominio = "http://192.168.38.40:3005";

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



});
