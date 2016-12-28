'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:ForestCtrl
 * @description
 * # ForestCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp')
  .controller('ForestCtrl', function ($scope, Upload) {
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
      if (files && files.length) {
        // for (var i = 0; i < files.length; i++) {
        //   Upload.upload({..., data: {file: files[i]}, ...})...;
        // }
        // or send them all together for HTML5 browsers:
        Upload.upload({
          url: 'http://localhost:9000/api/post/',
          arrayKey: '',
          data: {
            file: files
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
    }

  });
