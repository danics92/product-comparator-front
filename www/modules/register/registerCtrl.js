/**
 * Created by danilig on 15/05/17.
 */
app.controller("registroCtrl", function($rootScope,$http, $scope,$location){

    $scope.register = {};

    var obtenerLocalidadesRegistro = function(){
        console.log($rootScope.dominio);
        var ajax =  $http.get($rootScope.dominio + "/localidad/obtenerTodasLocalidades");
        ajax.success(function(data, status, headers, config){
            $scope.localidades = data;
        });
    };
    obtenerLocalidadesRegistro();

    $scope.doRegistro = function(){
        var ajax =  $http.post($rootScope.dominio + "/usuario/insertarUsuario",$scope.register);
        ajax.success(function(data, status, headers, config){
            $location.path("/login");
        });
    };



});
