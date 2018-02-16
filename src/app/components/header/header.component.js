(function() {
    'use strict';

    angular
    	.module('app.header')
    	.component("mainHeader",{
    		templateUrl: "app/components/header/header.html",
    		controller: "headerController",
    		controllerAs: "vm"
    	});

})();