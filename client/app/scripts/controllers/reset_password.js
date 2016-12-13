'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:ResetPasswordCtrl
 * @description
 * # ResetPasswordCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp').controller('ResetPasswordCtrl', function($scope, $http, config, $routeParams) {
  $scope.resetFormView = false;
  $scope.$on('$routeChangeSuccess', function() {
    console.log($routeParams.reset_code == '0');
    if ($routeParams.reset_code == '0') {
      $scope.resetFormView = false;
    }else {
      $scope.resetFormView = true;
    }
  });
  this.init = function() {

    // if($routeParam.reset_code === 0){
    //   console.log("email form");
    // }
  }
  $scope.reset_password = function() {
    console.log($scope.resetRequest.email);
    $http.get(config.baseUrl + 'api/users/reset_password_request/' + $scope.resetRequest.email).then(function(res) {

      //$scope.posts = res.data;
      console.log(res.data);

    }, function(res) {
      //console.log(res);
    });
  }
  $scope.reset_password_send_data = function() {
    console.log($routeParams.reset_code );
    if($routeParams.reset_code != '0'){
      $http.post(config.baseUrl + 'api/users/reset_password_request/',
      {
        id: $routeParams.reset_code,
        password: $scope.resetData.password
      }).then(function(res) {

      //$scope.posts = res.data;
      console.log(res.data);

    }, function(res) {
      //console.log(res);
    });
  }
  }
});
