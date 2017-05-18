/**
 * Created by danilig on 15/05/17.
 */
app.controller("scannerCtrl", function($scope,$cordovaBarcodeScanner){
    $scope.scanBarcode = function() {
        console.log("entra");
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
});