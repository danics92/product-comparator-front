/**
 * Created by danilig on 15/05/17.
 */
app.controller("misCarrosCtrl", function ($rootScope, $http, $scope, $ionicModal, $location, $ionicPopup, $ionicLoading) {
    $scope.verificarToken();

    var dataNuevoCarro = {};
    var dataEliminarCarro = {};
    var dataEditarCarro = {};
    var dinero = 0;


    $scope.index_carro = 0;

    $rootScope.showLoading();

    $scope.obtenerCarrosUsuario = function () {
        $scope.verificarToken();
        var carros = $http.post($rootScope.dominio + '/usario/carros/obtenerCarrosUsuario', $scope.token);
        carros.success(function (data, status, headers, config) {
            $scope.carros = data;
            $scope.obtenerPrecioCarros();

        });
        carros.error(function (data, status, headers, config) {
            console.log("aqui2");
            $scope.showFeedback("error", "ha surguido un error en la consulta");
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

        var precios = $http.post($rootScope.dominio + '/carro/obtenerPreciosCarro', dataCarros);
        precios.success(function (data, status, headers, config) {
            for (var i = 0; i < $scope.carros.length; i++) {
                $scope.carros[i].precioTotal = data[i];
            }
            $scope.carros.reverse();
            $rootScope.hideLoading();
        });
        precios.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "error en carros");
        });

    }


    $scope.popupNuevoCarro = function () {
        $ionicPopup.prompt({
            title: 'Introduzca el nombre del carro',
            inputType: 'text',
            inputPlaceholder: 'Nuevo nombre'
        }).then(function (nombre) {
            if (nombre != undefined && nombre != "") {
                dataNuevoCarro.accesToken = $scope.token.accesToken;
                dataNuevoCarro.nombre = nombre;
                $scope.addCart();
            } else {
                $scope.showFeedback("error", "El nombre no puede estar vacio");
            }
        });
    }


    $scope.addCart = function () {
        $scope.verificarToken();
        var nuevoCarro = $http.post($rootScope.dominio + '/usuario/carro/anadirCarroUsuario', dataNuevoCarro);
        nuevoCarro.success(function (data, status, headers, config) {
            console.log("carro añadido");
            console.log(data);
            $scope.carros.push(data);
            $scope.obtenerPrecioCarros();
            $scope.showFeedback("correcto", "se ha introducido un nuevo carro");

        });
        nuevoCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta");
        });
        $scope.carros.reverse();
    };

    $scope.popupEditarCarro = function (oldName, id_carro, index) {
        $ionicPopup.prompt({
            title: 'Modificar carro',
            inputType: 'text',
            inputPlaceholder: oldName
        }).then(function (nombre) {
            if (nombre != undefined && nombre != "") {
                dataEditarCarro.accesToken = $scope.token.accesToken;
                dataEditarCarro.nombre = nombre;
                dataEditarCarro.id_carro = id_carro;
                $scope.editCart(index, nombre);
            } else {
                $scope.showFeedback("error", "El campo no puede estar vacio");
            }
        });
    }

    $scope.editCart = function (index, nombre) {
        $scope.verificarToken();
        var editarCarro = $http.post($rootScope.dominio + '/usuario/carro/editarCarroUsuario', dataEditarCarro);
        editarCarro.success(function (data, status, headers, config) {
            $scope.carros[index].nombre = nombre;
            $scope.showFeedback("correcto", "carro editado con exito");
        });
        editarCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta");
        });
    };


    $scope.deleteCarro = function (id_carro, index) {
        $scope.verificarToken();
        dataEliminarCarro = {
            "accesToken": $scope.token.accesToken,
            "id_carro": id_carro
        };
        var deleteCarro = $http.post($rootScope.dominio + '/usuario/carro/eliminarCarroUsuario', dataEliminarCarro);
        deleteCarro.success(function (data, status, headers, config) {
            $scope.carros.splice(index, 1);
        });
        deleteCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta");
        });
    };

    $scope.obtenerCarrosUsuario();


    //////////Modal Productos carro ////////
    $scope.productosCarro = [];

    var obtenerProductosCarro = function (id_carro) {
        $scope.verificarToken();
        var dataProductosCarro = {
            "accesToken": $scope.token.accesToken,
            "id_carro": id_carro
        };
        var productosCarro = $http.post($rootScope.dominio + '/usuario/carro/obtenerProductosCarro', dataProductosCarro);
        productosCarro.success(function (data, status, headers, config) {
            $scope.productosCarro = data;
            console.log(data);
        });
        productosCarro.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta");
        });
    };

    $scope.eliminarProducto = function (index_producto, id_producto) {
        $scope.verificarToken();
        dataProductoEliminar = {
            "accesToken": $scope.token.accesToken,
            "id_carro": $scope.id_carro_modal,
            "id_producto_carro": id_producto
        };
        var eliminarProducto = $http.post($rootScope.dominio + '/usuario/carro/eliminarProductoCarro', dataProductoEliminar);
        eliminarProducto.success(function (data, status, headers, config) {
            $scope.productosCarro.splice(index_producto, 1);
            $scope.carros[$scope.index_carro].precioTotal -= data;
        });
        eliminarProducto.error(function (data, status, headers, config) {
            $scope.showFeedback("error", "ha surguido un error en la consulta");
        });
    };


    $scope.openModal = function (id_carro, index_carro) {
        $rootScope.showLoading();
        $scope.id_carro_modal = id_carro;
        $scope.index_carro = index_carro;
        obtenerProductosCarro(id_carro);
        $ionicModal.fromTemplateUrl('modules/myCart/productosCarroModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $rootScope.hideLoading();
        });
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove();
    };

});
