'use strict';

/**
 * @ngdoc service
 * @name naturenurtureApp.auth
 * @description
 * # auth
 * Factory in the naturenurtureApp.
 */
angular.module('naturenurtureApp')
  .factory('auth', function ($location, $http, $cookies, $q, config) {

    var currentUser = {}
    var promise = $q(function(resolve, reject) {
      if ($cookies.get('token') && $location.path() !== '/logout') {
        $http.get(config.baseUrl+'api/users/me').then(function(res) {
          //console.log(res);
          resolve(res.data)
          //currentUser = res.data
          //console.log(currentUser);

        }, function(res) {

        });

      }
    });
    promise.then(function (user) {
      currentUser = user;
      console.log(user);
    })
    var safeCb = function (cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      }







    // Public API here
    return {
      createUser: function (user) {
        //console.log("creating user");
        $http.post(config.baseUrl+'api/users/',user).then(function(data) {
          //console.log(data);
          $cookies.put('token', data.data.token);
          $http.get(config.baseUrl+'api/users/me').then(function(res) {
            //console.log(res);
            currentUser = res.data;

          }, function(res) {

          });

          //currentUser = res

        }, function(res) {

        });

      },
      getCurrentUser: function(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }
        $q.when(promise).then(function(user) {
          safeCb(callback)(user);
          //callback(user)
          return user;
        })
      }


    };
  });
