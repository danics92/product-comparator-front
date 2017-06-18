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
app.controller("productosCtrl", function ($rootScope, $http, $state, $scope, $ionicModal,$ionicPopover, $location, $ionicActionSheet, $timeout, $rootScope, $ionicPopup, filtradoService) {
;

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

    $scope.productoValorado = false;

    $scope.iconoSeguimiento = "gps_off";

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

        return (valoracionesUser / valoraciones.length).toFixed(2);
    };

     var comprobarValoracionUsuario = function(){
       $scope.verificarToken();
      var valoracionUsuario = $http.post($rootScope.dominio + '/producto/comprobarValoracionUsuario', $scope.token);
      valoracionUsuario.success(function (data, status, headers, config) {
          if(data.length > 0){
            for(var i = 0; i < $scope.productos.length; i++){
              $scope.productos[i].verBotonValorar = true;
              for(var j = 0; j < data.length; j++){
                if(data[j].idProducto == $scope.productos[i].id){
                  $scope.productos[i].verBotonValorar = false;
                  break;
                }
              }
            }
          }else{
            for(var j = 0; j < $scope.productos.length; j++){
                  $scope.productos[j].verBotonValorar = true;
            }
        }
        $rootScope.hideLoading();
      });
      valoracionUsuario.error(function (data, status, headers, config) {
          $scope.showFeedback("", "", 305);
      });
    }

    var comprobarSeguimientoProducto = function () {
      $scope.verificarToken();
        var seguimientos = $http.post($rootScope.dominio + '/usuario/seguimiento/obtenerTodosLosSeguimientos', $scope.token);
        seguimientos.success(function (data, status, headers, config) {
          if(data.length > 0){
            for (var i = 0; i < $scope.productos.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (data[j].idProducto == $scope.productos[i].id) {
                        $scope.productos[i].seguimientoImg = "gps_fixed";
                        $scope.productos[i].seguimiento = true;
                        break;
                    } else {
                        $scope.productos[i].seguimientoImg = "gps_off";
                        $scope.productos[i].seguimiento = false;
                    }
                }
            }
          }else{
              for (var i = 0; i < $scope.productos.length; i++) {
                $scope.productos[i].seguimientoImg = "gps_off";
                $scope.productos[i].seguimiento = false;
              }
          }
            $rootScope.hideLoading();
        });
        seguimientos.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta", 305);
        });
    };




    $scope.obtenerProductos = function () {
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
            for (var i = 0; i < data.length; i++) {
                var mejorPrecio = 0;
                var valoracion = 0;
                if (data[i].productoValoracion.length > 0) {
                    valoracion = obtenerValoracionTotal(data[i].productoValoracion);
                }

                $scope.productos.push(data[i]);
                $scope.productos[i].valoracionTotal = valoracion;
                $scope.productos[i].verBotonValorar = false;
                mejorPrecio = 0;
                valoracion = 0;
                obtenerTiendasDeProducto(i);
            }

            comprobarSeguimientoProducto();
            comprobarValoracionUsuario();

        });
        ajaxProductos.error(function (data, status, headers, config) {
            $scope.showFeedback("", "", 305);
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
            $scope.productos[index].seguimientoImg = "gps_fixed";
        });
        ajaxSeguimiento.error(function (data, status, headers, config) {
            $scope.showFeedback("Error", "ha habido un error en la consulta", 305);
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
            $scope.productos[index].seguimientoImg = "gps_off";
        });
        ajaxEliminarSeguimiento.error(function (data, status, headers, config) {
            $scope.showFeedback("Error", "ha habido un error en la consulta",305);
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

        var tiendas = $http.get($rootScope.dominio + '/tienda/obtenerTiendasPorIds?id_tiendas=' + id_tiendas);
        tiendas.success(function (data, status, headers, config) {
            $scope.tiendasBuenas = [];
            $scope.productoTiendasBueno = [];
            var indexProductoTienda = 0;
            if (!filtradoService.filtros.filtroActivado) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].idLocalidad == $rootScope.localidadUsuario) {
                        $scope.productoTiendasBueno.push($scope.productos[index].productoTiendas[i]);
                        $scope.tiendasBuenas.push(data[i]);
                    }
                }
                $scope.productos[index].productoTiendas = $scope.productoTiendasBueno;
                $scope.productos[index].productoTiendas.tiendas = $scope.tiendasBuenas;

            } else {
                if (filtradoService.filtros.localidad == 0) {

                    $scope.productos[index].productoTiendas.tiendas = data;

                } else {
                    var localidad;
                    if (filtradoService.filtros.localidad != 0) {
                        localidad = filtradoService.filtros.localidad;
                    } else {
                        localidad = $scope.localidadUsuario;
                    }
                    for (var i = 0; i < data.length; i++) {
                      if (data[i].idLocalidad == localidad) {
                          $scope.productoTiendasBueno.push($scope.productos[index].productoTiendas[i]);
                          $scope.tiendasBuenas.push(data[i]);
                      }
                    }
                    $scope.productos[index].productoTiendas = $scope.productoTiendasBueno;
                    $scope.productos[index].productoTiendas.tiendas = $scope.tiendasBuenas;
                }
            }
            if ($scope.productos[index].productoTiendas.length > 0) {
                mejorPrecio = obtenerPrecioMasBarato($scope.productos[index].productoTiendas);
            }else{
              mejorPrecio = 0;
            }
            $scope.productos[index].mejorPrecio = mejorPrecio;
            $rootScope.hideLoading();
        });
        tiendas.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "error en tiendas", 305);
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
            $scope.carros[index].precioTotal += data;
        });
        productoAnadido.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta", 305);
        });
    }

    $scope.openModal = function (index) {
        $rootScope.showLoading();
        $scope.indexProducto = index;

        $ionicModal.fromTemplateUrl('modules/productSearcher/productModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
        $rootScope.hideLoading();
    };

    $scope.closeModal = function () {
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
            $scope.closeCarroModal();
            $scope.showFeedback("error", "ha surguido un error en la consulta", 305);

        });
    };

    $scope.obtenerPrecioCarros = function () {
      $scope.verificarToken();
        var id_carros = [];

        for (var i = 0; i < $scope.carros.length; i++) {
            id_carros.push($scope.carros[i].id)
        }

        var dataCarros = {
            accesToken: $scope.token.accesToken,
            carros: id_carros
        }

        var precios = $http.post($rootScope.dominio + '/carro/obtenerPreciosCarro', dataCarros);
        precios.success(function (data, status, headers, config) {
            for (var i = 0; i < $scope.carros.length; i++) {
                $scope.carros[i].precioTotal = data[i];
            }
            $scope.carros.reverse();
            $rootScope.hideLoading();
        });
        precios.error(function (data, status, headers, config) {
          $scope.closeCarroModal();
            $scope.showFeedback("error", "ha surguido un error en la consulta", 305);
        });

    }


    $scope.openCarroModal = function (idProductoTienda) {
        $rootScope.showLoading();
        $scope.obtenerCarrosUsuario();
        $scope.idProductoTienda = idProductoTienda;
        $ionicModal.fromTemplateUrl('modules/productSearcher/carrosModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalCarro = modal;
            $scope.modalCarro.show();
        });
    };

    $scope.closeCarroModal = function () {
        $scope.modalCarro.hide();
        $scope.modalCarro.remove();
    };

    $scope.ordenarProductosEvento = function (contender, valor, orden) {
        $scope.ordenarProductos(contender, valor, orden);
    }


    $scope.ordenarProductos = function (contenedor, valor, orden) {
        $rootScope.showLoading();
        gestionarBotones(valor, orden);
        if (orden === "asc") {
            contenedor.sort(function (a, b) {
                if (valor === 'precio') {
                    return parseFloat(a.mejorPrecio) - parseFloat(b.mejorPrecio);
                } else if (valor === 'valoracion') {
                    return parseFloat(a.valoracionTotal) - parseFloat(b.valoracionTotal);
                }
            });
        } else if (orden === "desc") {
            contenedor.sort(function (a, b) {
                if (valor === 'precio') {
                    return parseFloat(b.mejorPrecio) - parseFloat(a.mejorPrecio);
                } else if (valor === 'valoracion') {
                    return parseFloat(b.valoracionTotal) - parseFloat(a.valoracionTotal);
                }
            });
        }
        $rootScope.hideLoading();
    }

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

    $scope.openModalMap = function (index) {
        $ionicModal.fromTemplateUrl('modules/productSearcher/mapaModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalMap = modal;
            $scope.modalMap.show().then(function () {
                setTimeout(function () {
                    var latLng = new google.maps.LatLng(39.6011121, 2.6871463);


                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        markers:[]
                    };


                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    for(var i = 0 ; i < $scope.productos[index].productoTiendas.tiendas.length; i++){
                      var tienda = $scope.productos[index].productoTiendas.tiendas[i];
                      var latLng = new google.maps.LatLng(tienda.latitud, tienda.longitud);
                      var marker = new google.maps.Marker({
                          position: latLng,
                          map: map,
                          title: 'Tienda'
                      });
                      mapOptions.markers.push(marker);
                    }





                }, 500);

            });
        });
    };

    $scope.closeModalMap = function () {
        $scope.modalMap.hide();
        $scope.modalMap.remove();
    };

    $scope.valorarProducto = function (id_producto, valoracion) {
        $scope.verificarToken();
        var dataValoracion = {
            accesToken: $scope.token.accesToken,
            id_producto: id_producto,
            valoracion: valoracion
        }
        var valorarAjax = $http.post($rootScope.dominio + "/producto/valorarProducto", dataValoracion);
        valorarAjax.success(function (data, status, headers, config) {
            $scope.productos[$scope.indexProducto].productoValoracion.push(data);
            $scope.productos[$scope.indexProducto].valoracionTotal = obtenerValoracionTotal($scope.productos[$scope.indexProducto].productoValoracion);
        });
        valorarAjax.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta", 305);
        });

    }

    $scope.popupValoracion = function (index) {
        $scope.prueba = {};
        $ionicPopup.prompt({
            title: 'Introduzca la valoracion',
            inputType: 'number',
            inputPlaceholder: '0-5'
        }).then(function (num) {
            if (num != undefined && num != "" && num >= 0 && num <= 5) {
                $scope.valorarProducto($scope.productos[$scope.indexProducto].id, num);
                $scope.productos[$scope.indexProducto].verBotonValorar = false;
            } else {
                $scope.showFeedback("error", "La valoracion debe ser de 0 a 5", "alert");
            }
        });
    }

    // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('templates/popoverOrdenar.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


$scope.openSubmenu = function(event){
    $scope.popover.show(event);
}

$scope.closeSubmenu = function(event){
    $scope.popover.close(event);
}



    $scope.obtenerProductos();

});
