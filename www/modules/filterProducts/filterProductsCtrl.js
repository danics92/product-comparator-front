/**
 * Created by danilig on 15/05/17.
 */


app.controller("filterProductsCtrl", function ($rootScope,$http, $scope, $location,$window,filtradoService) {  
$rootScope.showLoading();
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
    var categoriasTop =  $http.get($rootScope.dominio + "/categoria/obtenerCategoriasTop");
    categoriasTop.success(function(data, status, headers, config){
      console.log(data);
        $scope.categoriaGeneral = data;
        $scope.filtrado.categoriaGeneral = data[0];
    });
    categoriasTop.error(function(data, status, headers, config){

    });
  }

  $scope.obtenerSubcategorias = function(id_padre){
    var subcategorias = 0;
    if(id_padre === "0" || id_padre === undefined){
      subcategorias = $http.get($rootScope.dominio + "/categoria/obtenerTodasCategoriasPorPadre?esSubCategoria="+true);
    }else{
      subcategorias = $http.get($rootScope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
    }
    subcategorias.success(function(data, status, headers, config){
        $scope.subcategorias = data;
    });
    subcategorias.error(function(data, status, headers, config){

    });
  }

   $scope.obtenerProductos = function(id_padre){
     var productoCategoria = 0;
     if(id_padre === "0" || id_padre === undefined){
       productoCategoria =  $http.get($rootScope.dominio + "/categoria/obtenerTodasCategoriasPorPadre?esSubCategoria="+false);
     }else{
       productoCategoria =  $http.get($rootScope.dominio + "/categoria/ObtenerHijosDeCategoriaPadre?id_padre="+id_padre);
     }
    productoCategoria.success(function(data, status, headers, config){
        $scope.productos = data;
        $rootScope.hideLoading();
    });
    productoCategoria.error(function(data, status, headers, config){
        $scope.showFeedback("","",305);
    });
  }


  var obtenerLocalidadesRegistro = function(){
      var ajax =  $http.get($rootScope.dominio + "/localidad/obtenerTodasLocalidades");
      ajax.success(function(data, status, headers, config){
          $scope.localidades = data;
      });
      ajax.error(function(data, status, headers, config){
          $scope.localidades = data;
      });
  };

  $scope.realizarFiltrado = function(){
    if($scope.filtrado.categoriaGeneral === undefined || $scope.filtrado.categoriaGeneral === "" || $scope.filtrado.categoriaGeneral.id != null){
      filtradoService.filtros.categoriaGeneral = 0;
    }else{
      filtradoService.filtros.categoriaGeneral = $scope.filtrado.categoriaGeneral;
    }
    if($scope.filtrado.subcategoria === undefined || $scope.filtrado.subcategoria === ""){
        filtradoService.filtros.subcategoria =  0;
    }else{
        filtradoService.filtros.subcategoria =  $scope.filtrado.subcategoria;
    }
    if($scope.filtrado.subcategoria === undefined || $scope.filtrado.subcategoria === ""){
        filtradoService.filtros.subcategoria =  0;
    }else{
        filtradoService.filtros.subcategoria =  $scope.filtrado.subcategoria;
    }
    if($scope.filtrado.localidad === undefined || $scope.filtrado.localidad === ""){
      filtradoService.filtros.localidad = 0;
    }else{
      filtradoService.filtros.localidad =  $scope.filtrado.localidad;
    }

      filtradoService.filtros.calorias = $scope.calorias.value;
      filtradoService.filtros.hidratos = $scope.hidratos.value;
      filtradoService.filtros.proteinas = $scope.proteinas.value;
      filtradoService.filtros.grasas = $scope.grasas.value;

      filtradoService.filtros.filtroActivado = true;
      if($scope.filtrado.categoriaProductos === undefined || $scope.filtrado.categoriaProductos === "" ){
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
    filtradoService.filtros.filtroActivado = false;
    filtradoService.filtros.categoriaGeneral = 0;
    filtradoService.filtros.subcategoria = 0;
    filtradoService.filtros.categoriaProductos = 0;
    filtradoService.filtros.calorias = 1000;
    filtradoService.filtros.hidratos = 500;
    filtradoService.filtros.proteinas = 500;
    filtradoService.filtros.grasas = 50;
    filtradoService.filtros.localidad = 0;
    filtradoService.verFiltro = true;
    filtradoService.verEliminarFiltro = false;
    $window.history.back();
  }


 obtenerCategoriasTop();
 $scope.obtenerSubcategorias(1);
 $scope.obtenerProductos(2);
 obtenerLocalidadesRegistro();

});
