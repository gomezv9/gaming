(function() {
    'use strict';

    angular
    	.module('app.header')
    	.controller('headerController', function(){
    		  var vm = this;

              /* Menu Hamburger */

		      $('#nav-icon2').click(function(){
		          $(this).toggleClass('open');
		          $( "#menuMobile2" ).fadeToggle("fast" );
		      });

              /*******************/

              /* Dropdown in header */

              $(document).on("click", function () {
                  $(".dropdown-content").hide();
              });

              $(".dropdown-content").on("click", function (event) {
                  event.stopPropagation();
              });

              $(".browserCategory").click(function(event){
                  event.stopPropagation();
                  $(this).children('ul').slideToggle();
              })

              $(".iconArrow").click(function(event){
                  event.stopPropagation();
                  $(".dropdown-content").slideToggle();
              })

              /**************************/
			
    	});

})();