(function() {
    'use strict';

    angular
    	.module('app.header')
    	.controller('headerController', function(){
    		  var vm = this;

		      jQuery('#nav-icon2').click(function(){
		          jQuery(this).toggleClass('open');
		          jQuery( "#menuMobile2" ).fadeToggle("fast" );
		      });
			
    	});

})();