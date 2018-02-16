(function() {
    'use strict';

    angular.module('app.core')
        .config(askConfig);

    askConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function askConfig($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: 'app/main/main.html'
        })
    	$urlRouterProvider.when('', '/');
      $urlRouterProvider.otherwise('/404');
    }


})();
