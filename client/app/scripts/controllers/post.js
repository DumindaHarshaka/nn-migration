'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:PostCtrl
 * @description
 * # PostCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp')
  .controller('PostCtrl', function ($scope, $http, config, $location, $window, post, $routeParams) {
    $scope.$on('$viewContentLoaded', function(event) {
      $window.ga('send', 'pageview', { page: $location.url() });
    });
    this.init = function() {
      if ($routeParams.post_id) {
        $http.post(config.baseUrl + 'api/post/find_one',{ post_id: $routeParams.post_id }).then(function(res) {
          $scope.post = res.data;

        }, function(res) {
          $location.path("/forest");
        });

      }else {
        $location.path("/forest");
      }
      //var posts = this.posts

    }
    this.init();

    $scope.newlineToBr = function(string) {
      return String(string).replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    //
    //
    // generate post url
    //
    //
    $scope.postUrl = function (post) {
      return (config.baseUrl + 'post/'+ post._id)
    }


  });
