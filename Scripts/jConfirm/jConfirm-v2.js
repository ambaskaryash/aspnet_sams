/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);


/*
        jConfirm v.2
        Developed with love by Versatility Werks (http://flwebsites.biz)
        
        What it does:
        jConfirm quickly allows you to add beautiful confirmation messages with callbacks
        
        ** Requires jQuery **
        
        Example Usage:
        
        <a href='#' itemType='product' itemId='1' class='jConfirm'>Delete this Product</a>
        
        $('.jConfirm').jConfirm({
                message: 'You sure you to delete this?',
                confirm: 'YUPPERS',
                cancel: 'NO WAY!',
                openNow: false,
                callback: function(elem){
                        $.ajax('delete.php?type='+elem.attr(itemType)+'&id='+elem.attr(itemId), function(data){
                                if(data.success){
                                	alert("YAY, deleted!");
                                }
                                else{
                                	alert("NOPE, failed for some silly reason");
                                }
                        });
                }
        });
        
*/

/* Add the jConfirm div */
$('body').append("<div id='jConfirm'><div style='margin-bottom: 5px;'></div><a class='jYup'></a> <a class='jNope'></a></div>");
/* Cache it */
$jConfirmDiv = $('#jConfirm');
$jConfirmElem = 'undefined'; //needs to be defined as a global. Will be overwritten when popping up

/* Function to re-position tooltip */
function positionjConfirm(){
    var left, right, top;
    left = $jConfirmElem.offset().left;
    right = ($(window).width() - ($jConfirmElem.offset().left + $jConfirmElem.outerWidth()));
    //right =81;
    top = $jConfirmElem.offset().top + 28;
    if(left < right){
        $jConfirmDiv.removeClass('right').css('right','').css('left',left);
    }else{
        $jConfirmDiv.addClass('right').css('left','').css('right',right);
    }
    $jConfirmDiv.css('top',top);
}

/* Indicated whether open or closed to avoid checking clicks if not open */
$jConfirmDivOpen = false;

  $.fn.jConfirm = function(options) {

        /* Set default options */
          var options = $.extend({
                message: 'Are you sure?',
                confirm: 'Yup',
                cancel: 'Nope',
                openNow: false,
                callback: function(elem){
            		var url = elem.attr('href');
            		if(typeof url !== 'undefined' && url != ''){
	            		var isJS = url.substr(1, 11);
	            		if(isJS == 'javascript:'){
	                		eval(url.replace('javascript:', ''));
	            		}else{
	                    	window.location.href = url;
	                    }
                    }      
                }
       	   }, options);
        
        /* Cache the dom elements we're attaching to and the callback */
          $this = $(this);
          $jConfirmCallback = options.callback;
        
        /* Show jConfirm when the element is clicked */
        $this.on('click', function(e){
                e.preventDefault();
                $jConfirmDivOpen = true;
                $jConfirmElem = $(this);
                var link = $jConfirmElem.attr('href');
                $jConfirmDiv.find('div').html(options.message);
                $('.jYup').html(options.confirm);
                $('.jNope').html(options.cancel);
                positionjConfirm();
                $jConfirmDiv.slideDown('fast');
		  });
		  
		  /* If show now */
		  if(options.openNow){
                $jConfirmDivOpen = true;
                $jConfirmElem = $(options.openNow);
                var link = $jConfirmElem.attr('href');
                $jConfirmDiv.find('div').html(options.message);
                $('.jYup').html(options.confirm);
                $('.jNope').html(options.cancel);
				positionjConfirm();
                $jConfirmDiv.css('top',top).slideDown('fast');			  
		  }
}
    /* If clicked the confirm button, run the callback/include the original link's source, and hide jConfirm */
    $jConfirmDiv.on('click', '.jYup', function(e){
            e.preventDefault();
            $jConfirmDiv.hide();
            $jConfirmCallback($jConfirmElem);
    });

        /* If clicked the cancel button, hide jConfirm */
    $jConfirmDiv.on('click', '.jNope', function(e){
            e.preventDefault();
                $jConfirmDivOpen = false;
                   $jConfirmDiv.hide();
    });
    
    /* Close jConfirm if clicked outside it (only caveat, it'll close and reopen if you click another one) */
    $(document).on('mouseup', function(e){
                if($jConfirmDivOpen){
            if (!$jConfirmDiv.is(e.target)
                && $jConfirmDiv.has(e.target).length === 0)
            {
                $jConfirmDiv.slideUp('fast');
            }
                }
        });
    /* Window resize */
    $('body').resize(function(){
    	if($jConfirmDivOpen){
			positionjConfirm();
		}
	});