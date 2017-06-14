/**
 * Created by danilig on 15/05/17.
 */
app.service('filtradoService', function () {
    this.filtros = {
        categoriaGeneral: 0,
        subcategoria: 0,
        categoriaProductos: 0,
        calorias: 1000,
        hidratos: 500,
        grasas: 500,
        proteinas: 500,
        localidad: 0,
        page: 0,
        size: 20,
        filtroActivado: false
    }
    this.verFiltro = true;
    this.verEliminarFiltro = false;
});
app.controller("productosCtrl", function($rootScope,$http,$state, $scope,$ionicModal,$location,$ionicActionSheet,$timeout,$rootScope,$ionicPopup,filtradoService){

    $scope.verificarToken();

    $scope.productos = [];

    $scope.filtro = false;

    $scope.indexProducto = 0;

    $scope.carrosCompra = [];

    $scope.valorarData = {};

    $scope.valor = {};

    $scope.ordenarPrecioAscActivado = true;

    $scope.ordenarPrecioDescActivado = false;

    $scope.ordenarValoracionAscActivado = true;

    $scope.ordenarValoracionDescActivado = false;

    var indexCarro = 0;

    var obtenerPrecioMasBarato = function (productoTiendas) {
        var mejorPrecio = 0;
        var precioActual = 0;
        for (var i = 0; i < productoTiendas.length; i++) {
            if (productoTiendas[i].historialPrecio.length > 0) {
                for (var j = 0; j < productoTiendas[i].historialPrecio.length; j++) {
                    precioActual = productoTiendas[i].historialPrecio[j].precio;
                    if (mejorPrecio != 0) {
                        mejorPrecio = precioActual < mejorPrecio ? precioActual : mejorPrecio;
                    } else {
                        mejorPrecio = precioActual;
                    }
                }
            }
        }
        return mejorPrecio;
    };

    var obtenerValoracionTotal = function (valoraciones) {
        var valoracionesUser = 0;
        for (var i = 0; i < valoraciones.length; i++) {
            valoracionesUser += valoraciones[i].valoracion;
        }
        return (valoracionesUser / valoraciones.length);
    };

    var comprobarSeguimientoProducto = function () {
        var seguimientos = $http.post($rootScope.dominio + '/usuario/seguimiento/obtenerTodosLosSeguimientos', $scope.token);
        seguimientos.success(function (data, status, headers, config) {
          for(var i = 0; i < $scope.productos.length; i++){
              for(var j = 0; j < data.length; j++){
                  if(data[j].idProducto == $scope.productos[i].id){
                    $scope.productos[i].seguimientoImg = "favorite";
                    $scope.productos[i].seguimiento = true;
                    break;
                  }else {
                    $scope.productos[i].seguimientoImg = "favorite_border";
                    $scope.productos[i].seguimiento = false;
                  }
              }
            }
            $rootScope.hideLoading();
        });
        seguimientos.error(function (data, status, headers, config) {
          $scope.showFeedback("error","ha surguido un error en la consulta",305);
        });
    };


    $scope.obtenerProductos = function(){
        $rootScope.showLoading();
        $scope.verificarToken();
        var data = {
            accesToken: $scope.token.accesToken,
            categoriaGeneral: filtradoService.filtros.categoriaGeneral,
            subcategoria: filtradoService.filtros.subcategoria,
            categoriaProductos: filtradoService.filtros.categoriaProductos,
            calorias: filtradoService.filtros.calorias,
            hidratos: filtradoService.filtros.hidratos,
            grasas: filtradoService.filtros.grasas,
            proteinas: filtradoService.filtros.proteinas,
            localidad: filtradoService.filtros.localidad,
            filtradoActivado: filtradoService.filtros.filtroActivado,
            page: filtradoService.filtros.page,
            maxResult: filtradoService.filtros.size
        }
        var ajaxProductos = $http.post($rootScope.dominio + '/producto/obtenerProductosPorLocalidad', data);

        ajaxProductos.success(function (data, status, headers, config) {
          for(var i = 0; i < data.length; i++){
            var mejorPrecio = 0;
            var valoracion = 0;
            if(data[i].productoValoracion.length > 0){
                valoracion = obtenerValoracionTotal(data[i].productoValoracion);
            }
            if(data[i].productoTiendas.length > 0){
                mejorPrecio = obtenerPrecioMasBarato(data[i].productoTiendas);
            }
            $scope.productos.push(data[i]);
            $scope.productos[i].mejorPrecio = mejorPrecio;
            $scope.productos[i].valoracionTotal = valoracion;
            mejorPrecio = 0;
            valoracion = 0;
            obtenerTiendasDeProducto(i);
          }
            comprobarSeguimientoProducto();

        });
        ajaxProductos.error(function (data, status, headers, config) {
            $scope.showFeedback("","",305);
        });
    };

    var hacerSeguimiento = function (id_producto, index) {
        $scope.verificarToken();

        var dataSeguimiento = {
            accesToken: $scope.token.accesToken,
            id_producto: id_producto
        };

        var ajaxSeguimiento = $http.post($rootScope.dominio + '/usuario/seguimiento/realizarSeguimiento', dataSeguimiento);
        ajaxSeguimiento.success(function (data, status, headers, config) {
            $scope.productos[index].seguimiento = true;
            $scope.productos[index].seguimientoImg = "favorite";
        });
        ajaxSeguimiento.error(function (data, status, headers, config) {
            $scope.showFeedback("Error","ha habido un error en la consulta",305);
        });
    };

    var eliminarSeguimiento = function (id_producto, index) {
        $scope.verificarToken();
        var dataElimarSeguimiento = {
            accesToken: $scope.token.accesToken,
            id_producto: id_producto
        };
        var ajaxEliminarSeguimiento = $http.post($rootScope.dominio + '/usuario/seguimiento/eliminarSeguimiento', dataElimarSeguimiento);
        ajaxEliminarSeguimiento.success(function (data, status, headers, config) {
            $scope.productos[index].seguimiento = false;
            $scope.productos[index].seguimientoImg = "favorite_border";
        });
        ajaxEliminarSeguimiento.error(function (data, status, headers, config) {
            $scope.showFeedback("Error", "ha habido un error en la consulta");
        });
    }

    var obtenerTiendasDeProducto = function (index) {
        $scope.verificarToken();
        var id_tiendas = [];
        for (var i = 0; i < $scope.productos[index].productoTiendas.length; i++) {
            if ($scope.productos[index].productoTiendas[i].historialPrecio == undefined || $scope.productos[index].productoTiendas[i].historialPrecio.length <= 0) {
                $scope.productos[index].productoTiendas[i].historialPrecio.precio = 0;
            } else {
                $scope.productos[index].productoTiendas[i].historialPrecio.precio = $scope.productos[index].productoTiendas[i].historialPrecio[0].precio;
            }
            id_tiendas.push($scope.productos[index].productoTiendas[i].idTienda);
        }

        var tiendas = $http.get($rootScope.dominio + '/tienda/obtenerTiendasPorIds?id_tiendas='+id_tiendas);
        tiendas.success(function (data, status, headers, config) {
          console.log(data);
            $scope.tiendasBuenas = [];
            $scope.productoTiendasBueno = [];
            var indexProductoTienda = 0;
          if(!filtradoService.filtros.filtroActivado){
            for(var i = 0; i < data.length;i++){
              if(data[i].idLocalidad == $rootScope.localidadUsuario){
                $scope.productoTiendasBueno.push( $scope.productos[index].productoTiendas[i]);
                $scope.tiendasBuenas.push(data[i]);
              }
            }
            $scope.productos[index].productoTiendas = $scope.productoTiendasBueno;
              $scope.productos[index].productoTiendas.tiendas = $scope.tiendasBuenas;
          }else{
            if(filtradoService.filtros.localidad == 0){
              $scope.productos[index].productoTiendas.tiendas = data;
            }else{
              var localidad;
              if(filtradoService.filtros.localidad != 0){
                localidad = filtradoService.filtros.localidad;
              }else{
                localidad = $scope.localidadUsuario;
              }
            for(var i = 0; i < data.length;i++){
              if(data.idLocalidad == localidad){
                $scope.productos[index].productoTiendas.tiendas.push(data[i]);
              }else{
                  $scope.productos[index].productoTiendas.splice(i,1);
              }
            }
          }
        }
        $rootScope.hideLoading();
      });
        tiendas.error(function (data, status, headers, config) {
          $scope.showFeedback("error","error en tiendas",305);
        });
    };

    $scope.seguimientoManager = function (id_producto, index) {
        if (!$scope.productos[index].seguimiento) {
            hacerSeguimiento(id_producto, index);
        } else {
            eliminarSeguimiento(id_producto, index);
        }
    };

    $scope.anadirProductoACarro = function (id_carro, index) {

        $scope.verificarToken();

        var dataAnadirProducto = {
            accesToken: $scope.token.accesToken,
            id_carro: id_carro,
            idProductoTienda: $scope.idProductoTienda
        }

        var productoAnadido = $http.post($rootScope.dominio + '/usuario/carro/anadirProductoACarro', dataAnadirProducto);
        productoAnadido.success(function (data, status, headers, config) {
            console.log(data);
            $scope.carros[index].precioTotal += data;
        });
        productoAnadido.error(function (data, status, headers, config) {
$scope.showFeedback("error","ha surguido un error en la consulta",305);
      });
    }

  $scope.openModal = function(index) {
    $rootScope.showLoading();
    $scope.indexProducto = index;

    $ionicModal.fromTemplateUrl('modules/productSearcher/productModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
        $rootScope.hideLoading();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove();

  };



    $scope.obtenerCarrosUsuario = function () {
        $scope.verificarToken();
        var carros = $http.post($rootScope.dominio + '/usario/carros/obtenerCarrosUsuario', $scope.token);
        carros.success(function (data, status, headers, config) {
            $scope.carros = data;
            $scope.obtenerPrecioCarros();
        });
        carros.error(function (data, status, headers, config) {
          $scope.showFeedback("error","ha surguido un error en la consulta",305);

        });
    };

    $scope.obtenerPrecioCarros = function () {

        var id_carros = [];

        for (var i = 0; i < $scope.carros.length; i++) {
            id_carros.push($scope.carros[i].id)
        }

        var dataCarros = {
            accesToken: $scope.token.accesToken,
            carros: id_carros
        }

        var precios = $http.post($rootScope.dominio + '/carro/obtenerPreciosCarro',dataCarros);
        precios.success(function (data, status, headers, config) {
          for(var i = 0; i < $scope.carros.length; i++){
            $scope.carros[i].precioTotal = data[i];
          }
          $scope.carros.reverse();
          $rootScope.hideLoading();
        });
        precios.error(function (data, status, headers, config) {
          $scope.showFeedback("error","ha surguido un error en la consulta",305);
        });

    }


    $scope.openCarroModal = function(idProductoTienda) {
      $rootScope.showLoading();
      $scope.obtenerCarrosUsuario();
      $scope.idProductoTienda = idProductoTienda;
      $ionicModal.fromTemplateUrl('modules/productSearcher/carrosModal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modalCarro = modal;
          $scope.modalCarro.show();
        });
    };

    $scope.closeCarroModal = function() {
      $scope.modalCarro.hide();
      $scope.modalCarro.remove();
    };

    $scope.googleMapsUrl = "https://maps.google.com/maps/api/js?key=AIzaSyAWCcHwYV6V49ov4V750wsUXu-UK6t1GuA";

    $scope.ordenarProductosEvento = function (contender, valor, orden) {
        $scope.ordenarProductos(contender, valor, orden);
    }


  $scope.ordenarProductos = function(contenedor,valor,orden){
    $rootScope.showLoading();
        gestionarBotones(valor,orden);
        if(orden === "asc"){
          contenedor.sort(function(a,b){
            if(valor === 'precio'){
              console.log(contenedor);
              return parseFloat(a.mejorPrecio) - parseFloat(b.mejorPrecio);
            }else if(valor === 'valoracion'){
              return parseFloat(a.valoracionTotal) - parseFloat(b.valoracionTotal);
            }
          });
        }else if(orden === "desc"){
          contenedor.sort(function(a,b){
            if(valor === 'precio'){
              return parseFloat(b.mejorPrecio) - parseFloat(a.mejorPrecio);
            }else if(valor === 'valoracion'){
                return parseFloat(b.valoracionTotal) - parseFloat(a.valoracionTotal);
            }
          });
        }
        $rootScope.hideLoading();
  }


    $scope.obtenerProductos();

    var gestionarBotones = function (valor, orden) {
        if (valor === 'precio' && orden === 'asc') {
            $scope.ordenarPrecioAscActivado = false;
            $scope.ordenarPrecioDescActivado = true;
            return;
        } else if (valor === 'precio' && orden === 'desc') {
            $scope.ordenarPrecioAscActivado = true;
            $scope.ordenarPrecioDescActivado = false;
            return;
        } else if (valor === 'valoracion' && orden === 'asc') {
            $scope.ordenarValoracionAscActivado = false;
            $scope.ordenarValoracionDescActivado = true;
            return;
        } else if (valor === 'valoracion' && orden === 'desc') {
            $scope.ordenarValoracionAscActivado = true;
            $scope.ordenarValoracionDescActivado = false;
            return;
        }
    }

    $scope.openModalMap = function() {


        iniciarMapa();
      $ionicModal.fromTemplateUrl('modules/productSearcher/mapaModal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modalMap = modal;
          $scope.modalMap.show();
        });
    };

    $scope.closeModalMap = function() {
      $scope.modalMap.hide();
      $scope.modalMap.remove();
    };

    var iniciarMapa = function(){
        google.maps.event.addDomListener(window,'load',function(){
          var myLatlng = new google.maps.LatLng(37.3000,-120.4833);

          var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.mapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"),mapOptions);

          $scope.map = map;

        });
    }

    $scope.valorarProducto = function(id_producto,valoracion){
      $scope.verificarToken();
      var dataValoracion = {
        accesToken: $scope.token.accesToken,
        id_producto: id_producto,
        valoracion: valoracion
      }
      var valorarAjax = $http.post($rootScope.dominio + "/producto/valorarProducto",dataValoracion);
      valorarAjax.success(function (data, status, headers, config) {
        console.log(data);
        $scope.productos[$scope.indexProducto].productoValoracion.push(data);
        $scope.productos[$scope.indexProducto].valoracionTotal = obtenerValoracionTotal( $scope.productos[$scope.indexProducto].productoValoracion);
      });
      valorarAjax.error(function (data, status, headers, config) {
        console.log(data);
        $scope.showFeedback("error","ha surguido un error en la consulta",305);
      });

    }

    $scope.popupValoracion= function(index){
      $scope.prueba = {};
      $ionicPopup.prompt({
          title: 'Introduzca la valoracion',
          inputType: 'number',
          inputPlaceholder: '0-5'
      }).then(function (num) {
          if(num != undefined && num != "" && num >= 0 && num <= 5){
              $scope.valorarProducto($scope.productos[$scope.indexProducto].id,num);
          }else{
              $scope.showFeedback("error","La valoracion debe ser de 0 a 5","alert");
          }
      });
    }




});
