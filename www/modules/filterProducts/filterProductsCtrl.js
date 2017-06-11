/**
 * Created by danilig on 15/05/17.
 */


app.controller("filterProductsCtrl", function ($http, $scope, $location,$window,filtradoService) {
$scope.categoriaGeneral= {};
$scope.subcategorias = {};
$scope.productos = [];
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
$scope.verEliminarFiltro = filtradoService.verEliminarFiltro;

  var obtenerCategoriasTop = function(){
    var categoriasTop =  $http.get($scope.dominio + "/categoria/obtenerCategoriasTop");
    categoriasTop.success(function(data, status, headers, config){
      console.log(data);
        $scope.categoriaGeneral = data;
        $scope.filtrado.categoriaGeneral = data[0];
    });
  }

  $scope.obtenerSubcategorias = function(id_padre){
    var subcategorias = 0;
    if(id_padre === "0"){
      subcategorias = $http.get($scope.dominio + "/categoria/obtenerTodasCategoriasPorPadre?esSubCategoria="+true);
    }else{
      subcategorias = $http.get($scope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
    }
    subcategorias.success(function(data, status, headers, config){
      console.log(data);
        $scope.subcategorias = data;
    });
    subcategorias.error(function(data, status, headers, config){
      console.log(data);
    });
  }

   $scope.obtenerProductos = function(id_padre){
     var productoCategoria = 0;
     if(id_padre == "0"){
       productoCategoria =  $http.get($scope.dominio + "/categoria/obtenerTodasCategoriasPorPadre?esSubCategoria="+false);
     }else{
       productoCategoria =  $http.get($scope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
     }
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
      filtradoService.filtros.calorias = $scope.calorias.value;
      filtradoService.filtros.hidratos = $scope.hidratos.value;
      filtradoService.filtros.proteinas = $scope.proteinas.value;
      filtradoService.filtros.grasas = $scope.grasas.value;
      filtradoService.filtros.localidad = $scope.filtrado.localidad;
      filtradoService.filtros.filtroActivado = true;
      if($scope.filtrado.categoriaProductos == 0){
        $scope.filtrado.categoriaProductos = [];
        for(var i = 0; i < $scope.productos.length;i++){
            $scope.filtrado.categoriaProductos.push($scope.productos[i].id);
        }
        filtradoService.filtros.categoriaProductos = $scope.filtrado.categoriaProductos;
      }else{
        filtradoService.filtros.categoriaProductos = $scope.filtrado.categoriaProductos;
      }
      filtradoService.verEliminarFiltro = true;
      $window.history.back();
  }

  $scope.eliminarFiltro = function(){
    filtradoService.filtrado.filtroActivado = false;
    filtradoService.filtros.categoriaGeneral = 0;
    filtradoService.filtros.subcategoria = 0;
    filtradoService.filtrado.categoriaProductos = 0;
    filtradoService.filtros.calorias = 1000;
    filtradoService.filtros.hidratos = 500;
    filtradoService.filtros.proteinas = 500;
    filtradoService.filtros.grasas = 50;
    filtradoService.filtros.localidad = 0;
    filtradoService.verFiltro = true;
    filtradoService.verEliminarFiltro = false;
    $scope.obtenerProductos();
  }


 obtenerCategoriasTop();
 $scope.obtenerSubcategorias(1);
 $scope.obtenerProductos(2);
 obtenerLocalidadesRegistro();

});
