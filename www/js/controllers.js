angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller("loginCtrl", function($http, $scope,$ionicModal){
    $scope.loginData = {};

  $scope.login = function(){
    console.log("dentro funcion");
    $http.post("http://localhost:3005/token/crearToken",$scope.loginData)
        .then(function(resp){
            console.log(resp.data);

        });
  }

  $ionicModal.fromTemplateUrl('templates/registro.html', {
    scope: $scope,
     animation: 'slide-in-up'
  }).then(function(modal) {
    console.log(modal);
    $scope.modal = modal;
  });

  $scope.register = {};

  $http.get("http://localhost:3005/ObtenerTodasLocalidades")
  .then(function(response){
      $scope.localidades =  response.data;
  });

  $scope.registro = function(){
    $scope.error.nombreObligatorio = true;
      /*console.log($scope.register);
      $http.post("http://localhost:3005/usuario/insertarUsuario",$scope.register)
          .then(function(resp){
              console.log(resp.data);
          });
          */
  };

  $scope.error = {
    nombreObligatorio: false
  };

});
