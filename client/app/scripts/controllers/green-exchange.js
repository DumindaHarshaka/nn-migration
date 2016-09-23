'use strict';

/**
 * @ngdoc function
 * @name naturenurtureApp.controller:GreenExchangeCtrl
 * @description
 * # GreenExchangeCtrl
 * Controller of the naturenurtureApp
 */
angular.module('naturenurtureApp')
  .controller('GreenExchangeCtrl', function(NgMap) {

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

    this.collapse = false;
    this.doCollapse = function functionName() {
      this.collapse = !this.collapse;
      console.log(this.collapse);
    }


  });
