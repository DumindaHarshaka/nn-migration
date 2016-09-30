'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:GreenExchangeCtrl
 * @description
 * # GreenExchangeCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp')
  .controller('GreenExchangeCtrl', function($scope, NgMap, $http) {
    $scope.posts = []

    //plant form population
    //prepare for $setPristine
    $scope.pform = {};


    var vm = this;
    vm.types = "['establishment']";
    vm.placeChanged = function() {
      vm.place = this.getPlace();
      console.log('location', vm.place.geometry.location);
      vm.map.setCenter(vm.place.geometry.location);
    }
    NgMap.getMap().then(function(map) {
      vm.map = map;
    });

    $scope.collapse = false;
    $scope.doCollapse = function functionName() {
      $scope.collapse = !$scope.collapse;
      console.log($scope.collapse);
    }

    $scope.plant = {}
    $scope.submitForm = function() {
        var plant = $scope.plant;
        $scope.plant.plantLoading = true;
        console.log($scope.plant);
        $http.post('http://localhost:9000/api/plant/', $scope.plant).then((function(a) {
          return function(res) {
            console.log(res);
            $scope.posts.unshift(res.data);
            plant.plantLoading = false;
            $scope.plant = {}
            $scope.plant.type = 'Exchange';
            $scope.pform.plantForm.$setPristine();
          }

        })($scope.plant), function(res) {
          console.log(res);
        });

      }
      //var init_obj = this;
    this.init = function() {
      //var posts = this.posts
      $http.get('http://localhost:9000/api/plant/').then(function(res) {

        $scope.posts = res.data;
        console.log($scope.posts);

      }, function(res) {
        console.log(res);
      });
    }
    this.init();

    //checking post type
    $scope.plant.type = 'Exchange';

    //var type_obj = this;
    //console.log(type_obj.plant.type);
    $scope.checkType = function(string) {
      //console.log(type_obj.plant.type);
      return $scope.plant.type == string ? 'active' : '';
    }
    $scope.typeTabClick = function(str) {
      $scope.plant.type = str
    }

    $scope.getPostType = function(str) {
      return str
    }




    $scope.submitResponse = function(post) {
        //console.log('FORM - '+$scope.a);
      var loading = post.responseLoading = true;
      console.log(post.new_response);

      $http.post('http://localhost:9000/api/plant/response',{id:post._id,response:post.new_response}).then((function(post,$scope) {
        return function(res) {
          console.log(res);
          post.responseLoading = false;

          //console.log($scope.responseForm);
          post.new_response = {};
          post.responseForm.$setPristine();

          post.responses = res.data.responses;

          post.response_form_class = '';
          //console.log(post);
        }


      })(post,$scope), function(res) {
        console.log(res);
      });
    }

    //collapse sign up form
    $scope.isSignUpCollapse = false;
    $scope.signUpCollapse  = function() {
      $scope.isSignUpCollapse = !$scope.isSignUpCollapse
    }

  });
