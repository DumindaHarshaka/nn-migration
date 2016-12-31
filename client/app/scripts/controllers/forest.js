'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:ForestCtrl
 * @description
 * # ForestCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp').controller('ForestCtrl', function($scope, Upload, $http, config, auth) {
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
  //
  //
  //collapse sign up form
  //
  //
$scope.isSignUpCollapse = false;
$scope.signUpCollapse = function() {
    $scope.isSignUpCollapse = !$scope.isSignUpCollapse
  }
  //
  //
  //signup
  //
  //
$scope.signUp = function() {
    $scope.user.name = $scope.user.first_name.toLowerCase();
    //console.log($scope.user);
    auth.createUser($scope.user).then(function(res) {

      if (res.hasOwnProperty('role')) {
        $scope.verify_email_notification = true;
      }else if (res.status == 422) {
        $scope.duplicate_email = true;
      }

    })


  }

  $scope.isLoggedIn = function() {
    //console.log(auth.isLoggedIn());
    return auth.isLoggedIn();

  }

  $scope.isMyPost = function(post) {
    if (auth.getCurrentUserObj() && auth.getCurrentUserObj() !== null) {
      //console.log(post);
      if (post.instant === true) {
        return post.owner_email === auth.getCurrentUserObj().email
      }
      return post.owner._id === auth.getCurrentUserObj()._id
    }
  }

  $scope.d = function() {
    console.log("efs");
  }

  $scope.submit = function() {
    $scope.postLoading = true;
    console.log('submitting...');
    if ($scope.postForm.file.$valid && $scope.files && $scope.files.length) {
      $scope.uploadFiles($scope.files);
    } else {
      console.log('errrr');
      auth.getCurrentUser().then(function(res) {

        $scope.post.owner = res._id;
        $scope.post.type = 'post';
        $http.post(config.baseUrl + 'api/post/', {post: $scope.post}).then(function(res) {
          console.log(res);
          $scope.postLoading = false;
          $scope.post = {}
          $scope.postForm.$setPristine();
          $scope.files = [];
        });
      })

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
          url: config.baseUrl+'api/post/',
          arrayKey: '',
          data: {
            file: files,
            post: $scope.post
            //'username': $scope.username
          }
        }).then(function(resp) {
          //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          console.log(resp.data);
          $scope.postLoading = false;
          $scope.post = {}
          $scope.postForm.$setPristine();
          $scope.files = [];
        }, function(resp) {
          console.log('Error status: ' + resp.status);
        }, function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $scope.progressPercentage = progressPercentage;
          console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
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
      return 'img-' + post.images.length;
    } else {
      return 'img-4';
    }
  }

  $scope.edit = function(post) {
    post.shadow = $scope.getShadow(post);
    post.editing = true;
    //console.log(post);
  }

  $scope.enable_editing = function(post) {
    post.shadow = $scope.getShadow(post);
    post.editing = true;

  };

  $scope.edit_cancel = function(post) {
    post.editing = false;
  }

  $scope.getShadow = function(obj) {
    if (null == obj || "object" != typeof obj)
      return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr))
        copy[attr] = obj[attr];
      }
    return copy;
  }

  $scope.submit_edit_post = function(post) {
    post.shadow.editInProgress = true;

    //delete unnessersary properties
    //delete post.shadow.responseForm;
    //delete post.shadow.responses;

    $http.put(config.baseUrl + 'api/post/' + post._id, post.shadow).then(function(res) {
      //console.log(res);
      post.shadow.editInProgress = false
      post.shadow = {}
      post.editing = false;

      post.subject = res.data.subject;
      post.body = res.data.body;
      post.images = res.data.images

    });
  }
  //
  //
  //submit edit form to API
  //
  //

});
