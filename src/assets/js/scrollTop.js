/*jshint esversion: 6 */

(() => {
    'use strict';

    $(document).ready(function(){

    	$(document).on('scroll', function(){
    		var scroll=$('html');
    		var modHeight=window.innerHeight;
			if($(this).scrollTop()>  100){
		    	$('.as__scrollToTop').fadeIn();
		    }
		    else{
		    	$('.as__scrollToTop').fadeOut();
		    }

    	});
	});

	//Click event to scroll to top
	$('.as__scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},'slow');
		return false;
	});

})();
