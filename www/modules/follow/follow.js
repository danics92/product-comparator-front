/**
 * Created by danilig on 15/05/17.
 */
app.controller("seguimientoCtrl", function($http, $scope,$ionicModal,$location){
    $scope.verificarToken();

    $scope.seguimientos = {};

    $scope.obtenerSeguimientos = function(){
        $scope.verificarToken();

        var res = $http.post($scope.dominio + '/usuario/seguimiento/obtenerTodosLosSeguimientos',$scope.token);
        res.success(function (data, status, headers, config) {
          $scope.seguimientos = data;
        });

};
    $scope.obtenerSeguimientos();


});
