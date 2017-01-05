'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp').controller('MainCtrl', function($scope, $http, config, auth, $q, $location, $window) {
  $scope.$on('$viewContentLoaded', function(event) {
    $window.ga('send', 'pageview', {page: $location.url()});
  });
  $scope.login = function() {
    console.log($scope.user);
    auth.login($scope.user).then(function() {
      auth.getCurrentUser().then(function(res) {
        console.info(res);
        //$window.location.reload();

        $location.path("/green-exchange");
      });
    });
  }
  $scope.isLoggedIn = function() {
    //console.log(auth.isLoggedIn());
    return auth.isLoggedIn();

  }
});
