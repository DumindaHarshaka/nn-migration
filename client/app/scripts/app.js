'use strict';

/**
 * @ngdoc overview
 * @name naturenurtureApp
 * @description
 * # naturenurtureApp
 *
 * Main module of the application.
 */
angular
  .module('naturenurtureApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMap'
  ])
  .controller('NavbarController', function ($scope,$location) {
    $scope.getClass = function(path) {
      //console.log($location.path().substr(0, path.length));
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
  })
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/myroute', {
        templateUrl: 'views/myroute.html',
        controller: 'MyrouteCtrl',
        controllerAs: 'myroute'
      })
      .when('/green-exchange', {
        templateUrl: 'views/green-exchange.html',
        controller: 'GreenExchangeCtrl',
        controllerAs: 'greenExchange'
      })
      .when('/email-verified', {
        templateUrl: 'views/email-verified.html',
        controller: 'EmailVerifiedCtrl',
        controllerAs: 'emailVerified'
      })
      .when('/email-discarded', {
        templateUrl: 'views/email-discarded.html',
        controller: 'EmailDiscardedCtrl',
        controllerAs: 'emailDiscarded'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  });
