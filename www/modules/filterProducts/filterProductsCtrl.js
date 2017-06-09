/**
 * Created by danilig on 15/05/17.
 */

 app.service('filtradoService', function() {
    this.filtros = {
      categoriaGeneral:0,
      subcategoria:0,
      categoriaProductos:0,
      calorias:1000,
      hidratos:500,
      grasas:500,
      proteinas:500,
      localidad:0

    }
    this.filtrosActivado = false;
});
app.controller("filterProductsCtrl", function ($http, $scope, $location,$window,filtradoService) {
$scope.categoriaGeneral= {};
$scope.subcategorias = {};
$scope.productos = {};
$scope.localidad = {};
$scope.localidades = {};
$scope.filtrado = {};
$scope.calorias = {
  min:0,
  max:1000,
  value:1000
};
$scope.hidratos = {
  min:0,
  max:500,
  value:500
};
$scope.grasas = {
  min:0,
  max:500,
  value:500
};
$scope.proteinas = {
  min:0,
  max:500,
  value:500
};

  var obtenerCategoriasTop = function(){
    var categoriasTop =  $http.get($scope.dominio + "/categoria/obtenerCategoriasTop");
    categoriasTop.success(function(data, status, headers, config){
      console.log(data);
        $scope.categoriaGeneral = data;
    });
  }

  $scope.obtenerSubcategorias = function(id_padre){
    var subcategorias =  $http.get($scope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
    subcategorias.success(function(data, status, headers, config){
      console.log(data);
        $scope.subcategorias = data;
    });
    subcategorias.error(function(data, status, headers, config){
      console.log(data);
    });
  }

   $scope.obtenerProductos = function(id_padre){
    var productoCategoria =  $http.get($scope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
    productoCategoria.success(function(data, status, headers, config){
      console.log(data);
        $scope.productos = data;
    });
    productoCategoria.error(function(data, status, headers, config){
      console.log(data);
    });
  }


  var obtenerLocalidadesRegistro = function(){
      console.log($scope.dominio);
      var ajax =  $http.get($scope.dominio + "/localidad/obtenerTodasLocalidades");
      ajax.success(function(data, status, headers, config){
          $scope.localidades = data;
      });
      ajax.error(function(data, status, headers, config){
          $scope.localidades = data;
      });
  };

  $scope.realizarFiltrado = function(){
      filtradoService.filtros.categoriaGeneral = $scope.filtrado.categoriaGeneral;
      filtradoService.filtros.subcategoria = $scope.filtrado.subcategoria;
      filtradoService.filtros.categoriaProductos = $scope.filtrado.categoriaProductos;
      filtradoService.filtros.calorias = $scope.calorias.value;
      filtradoService.filtros.hidratos = $scope.hidratos.value;
      filtradoService.filtros.proteinas = $scope.proteinas.value;
      filtradoService.filtros.grasas = $scope.grasas.value;
      filtradoService.filtros.localidad = $scope.filtrado.localidad;
      filtradoService.filtrosActivado = true;
      $window.history.back();
  }

 obtenerCategoriasTop();
 $scope.obtenerSubcategorias(1);
 $scope.obtenerProductos(2);
 obtenerLocalidadesRegistro();

});
