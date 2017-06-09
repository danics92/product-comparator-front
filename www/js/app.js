// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

    .run(function ($ionicPlatform,$rootScope) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }

            $rootScope.dominio = "http://localhost:3005";
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $provide, $ionicConfigProvider) {

        $ionicConfigProvider.views.maxCache(0);


        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.contact', {
                url: '/contact',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/contact/contacto.html',
                        controler: 'contactCtrl'
                    }
                }
            })

            .state('app.products', {
                url: '/products',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/productSearcher/productos.html',
                        controler: 'productSearcherCtrl'
                    }
                }
            })
            .state('app.micarrito', {
                url: '/micarrito',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/myCart/micarrito.html',
                        controller: 'misCarrosCtrl'
                    }
                }
            })
            .state('app.seguimientos', {
                url: '/seguimientos',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/follow/seguimientos.html',
                        controller: 'seguimientoCtrl'
                    }
                }
            })
            .state('app.scanner', {
                url: '/scanner',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/scanner/scanner.html',
                        controller: 'scannerCtrl'
                    }
                }
            })
            .state('app.productos', {
                url: '/productos',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/productSearcher/productos.html',
                        controller: 'productosCtrl'
                    }
                }
            })
            .state('app.filtrar', {
                url: '/filtrar',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/filterProducts/filtradoProductos.html',
                        controller: 'filterProductsCtrl'
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'loginCtrl',
                templateUrl: 'modules/login/login.html'

            }).state('registro', {
            url: '/registro',
            controller: 'registroCtrl',
            templateUrl: 'modules/register/registro.html'

        });

        $provide.factory('AuthInterceptor', function ($q, $location) {

            return {
                // On request success
                request: function (config) {



                    // console.log(config); // Contains the data about the request before it is sent.
                    if (($location.path() === "/login" || $location.path() === "/registro") && localStorage.getItem("access_token")) {

                        $location.path("/app/micarrito");

                    } else if (!localStorage.getItem("access_token") && $location.path() != "/registro") {
                        $location.path("/login");

                    } else if (localStorage.getItem("access_token")) {

                    }


                    return config || $q.when(config);
                    // Return the config or wrap it in a promise if blank.

                },
                // On response success
                response: function (response) {
                    // console.log(response); // Contains the data from the response.
                    // Return the response or promise.

                    return response || $q.when(response);
                }
            };
        });

        $httpProvider.interceptors.push('AuthInterceptor');

        if (localStorage.getItem("access_token")) {
            $urlRouterProvider.otherwise('/app/micarrito');
        } else {
            $urlRouterProvider.otherwise('/login');
        }


        // if none of the above states are matched, use this as the fallback
    });
