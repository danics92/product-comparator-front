/**
 * Created by danilig on 15/05/17.
 */
app.controller("filterProductsCtrl", function ($http, $scope, $location) {

$scope.categoriaGeneral = {};
$scope.subcategorias = {};
$scope.categoriaProductos = {};



  var obtenerCategoriasTop = function(){
    var categoriasTop =  $http.get($scope.dominio + "/categoria/obtenerCategoriasTop");
    categoriasTop.success(function(data, status, headers, config){
      console.log(data);
        $scope.categoriaGeneral = data;
    });
    categoriasTop.error(function(data, status, headers, config){
      console.log(data);
    });
  }


  var obtenerSubcategorias = function(id_padre){
    var subcategoria =  $http.get($scope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
    subcategoria.success(function(data, status, headers, config){
      console.log(data);
        $scope.subcategorias = data;
    });
    subcategoria.error(function(data, status, headers, config){
      console.log(data);
    });
  }

  var obtenerCategoriaProductos = function(id_padre){
    var categoriaProductos =  $http.get($scope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
    categoriaProductos.success(function(data, status, headers, config){
      console.log(data);
        $scope.categoriaProductos = data;
    });
    categoriaProductos.error(function(data, status, headers, config){
      console.log(data);
    });
  }

  obtenerCategoriasTop();
  obtenerSubcategorias(1);
  obtenerCategoriaProductos(2);

});
