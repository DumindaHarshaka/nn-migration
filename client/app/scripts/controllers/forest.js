'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:ForestCtrl
 * @description
 * # ForestCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp').controller('ForestCtrl', function($scope, Upload ,$http, config, auth) {
  this.init = function() {
    //var posts = this.posts
    $http.get(config.baseUrl + 'api/post/').then(function(res) {

      $scope.posts = res.data;
      //console.log($scope.posts);

    }, function(res) {
      //console.log(res);
    });
  }
  this.init();

  $scope.d = function() {
    console.log("efs");
  }

  $scope.submit = function() {
    console.log('submitting...');
    if ($scope.postForm.file.$valid && $scope.files) {
      $scope.uploadFiles($scope.files);
    }
  };

  // for multiple files:
  $scope.uploadFiles = function(files) {
    auth.getCurrentUser().then(function(res) {
      $scope.post.owner = res._id;
      $scope.post.type = 'post';
      if (files && files.length) {
        console.log(files);
        Upload.upload({
          url: 'http://localhost:9000/api/post/',
          arrayKey: '',
          data: {
            file: files,
            post: $scope.post
            //'username': $scope.username
          }
        }).then(function(resp) {
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function(resp) {
          console.log('Error status: ' + resp.status);
        }, function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      }
    });

  }



  $scope.dim = function(file, width, height) {
    console.log(file);
    console.log(width);
    console.log(height);
  }

  $scope.imageGridClass = function(post) {
    if (post.images.length < 5) {
      return 'img-'+post.images.length;
    }else {
      return 'img-5-plus';
    }
  }

});
