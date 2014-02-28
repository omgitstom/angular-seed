'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);

 myApp.controller('MyCtrl3', function($scope) {
     $scope.users = [
         { email: 'tom@mailinator.com', password: 'IAmTheGreatest' }
     ];

     $scope.addUser = function () {
          $scope.users.push(
            {
             email: $scope.newUser.email,
             password: $scope.newUser.password
           });

         $http('POST', url, post, function(status, response){
             // success
         }, function(status, response){
             // error
         });

        };

 });


myApp.controller('LoginCtrl', function($scope, $rootScope, $location, SessionService) {
    $scope.user = {username: '', password: ''};

    $scope.login = function() {
        alert("HERE")
        $scope.user = SessionService.save($scope.user, function(success) {
            $rootScope.loggedIn = true;
            $location.path('/login');
            alert("GOT HERE!!!")
        }, function(error) {
            $scope.loginError = true;
            alert("ERROR was received.")
        });
    };
});


myApp.factory('SessionService', function($resource) {
    return $resource('/api/sessions');
});


//myApp.config(function($httpProvider) {
//    $httpProvider.interceptors.push(function($rootScope, $location, $q) {
//        return {
//            'request': function(request) {
//                // if we're not logged-in to the AngularJS app, redirect to login page
//                $rootScope.loggedIn = $rootScope.loggedIn || $rootScope.username;
//                if (!$rootScope.loggedIn && $location.path() != '/login') {
//                    $location.path('/login');
//                }
//                return request;
//            },
//            'responseError': function(rejection) {
//                // if we're not logged-in to the web service, redirect to login page
//                if (rejection.status === 401 && $location.path() != '/login') {
//                    $rootScope.loggedIn = false;
//                    $location.path('/login');
//                }
//                return $q.reject(rejection);
//            }
//        };
//    });
//});


function Hello($scope, $http) {
    $http.defaults.headers.common.Authentication = 'Basic NkhWNEFLQzBWV0pCWThNSlpBTTlTQVFOMjpaRi9KMVVqaXRLZlMvOGZCbi84VWdCcWZMNkJaZ09jTGh5WTJwbmJMYkdN';
    $http.get('https://api.stormpath.com/v1/tenants/Ad8mIcavSty7XzD-xZdP3g').
        success(function(data) {
            alert("SUCCEDDED!!!");
            $scope.greeting = data;
        })
        .error(function(data) {
            alert("ERRORED!!!");
            $scope.myerrors = data;
        });
}

//apiKey.id = 6HV4AKC0VWJBY8MJZAM9SAQN2
//apiKey.secret = ZF/J1UjitKfS/8fBn/8UgBqfL6BZgOcLhyY2pnbLbGM


  function AlertDemoCtrl($scope) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: "Another alert!"});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}