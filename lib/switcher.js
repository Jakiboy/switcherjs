/**
 * light jQuery Switcher Plugin
 *
 * @version  : 1.0.0
 * @requires : jQuery >= 1.7
 * @author   : JIHAD SINNAOUR
 * @website  : https://jakiboy.github.io/switcherjs/
 * @license  : MIT license
 */
(function($){
	"use strict";
	// Prevent multiple script inits
	if (typeof($.fn.switcher) != 'undefined') {return false;}
	$.fn.switcher = function(onText, offText) {
		// Destruct
		$.fn.switchDestroy = function() {
			$(this).each(function() {
                var $wrap = $(this).parents('.switch-wrap');
				$wrap.children().not('input').remove();
				$(this).unwrap();
            });
			return true;
		};
		// Set to ON
		$.fn.switchOn = function() {
			$(this).each(function(i, v) {
                var $wrap = $(this).parents('.switch-wrap'),
					$input = $wrap.find('input');
				// If is already on - skip
				if ($wrap.find('.switch-on').length) {
					return true;	
				}
				(typeof($.fn.prop) == 'function') ? $input.prop('checked', true) : $input.attr('checked', true);
				$input.trigger('switcher-on');
				$input.trigger('switcher-changed');
				$wrap.find('.switcher-input').removeClass('switch-off').addClass('switch-on');
				// If radio - disable other ones 
				if ( $wrap.find('.switcher-input').hasClass('radio-switch') ) {
					var inpName = $input.attr('name');
					$wrap.parents('form').find('input[name='+inpName+']').not($input).switchOff();	
				}
            });
			return true;
		};
		// Set to OFF
		$.fn.switchOff = function() {
			$(this).each(function() {
                var $wrap = $(this).parents('.switch-wrap'),
					$input = $wrap.find('input');
				// If is already off - skip
				if (!$wrap.find('.switch-on').length) {
					return true;	
				}
				// Uncheck
				(typeof($.fn.prop) == 'function') ? $input.prop('checked', false) : $input.attr('checked', false);
				$input.trigger('switcher-off');
				$input.trigger('switcher-changed');
				$wrap.find('.switcher-input').removeClass('switch-on').addClass('switch-off');
            });
			return true;
		};
		// Toggle status
		$.fn.switchToggle = function() {
			$(this).each(function() {
				// Not for radios
				if ( $(this).hasClass('radio-switch')) {
					return true;	   
				}
				($(this).is(':checked')) ? $(this).switchOff() : $(this).switchOn();
            });
			return true;
		};
		// Construct
		return this.each(function(){
			// Check against double init
			if ( !$(this).parent().hasClass('switch-wrap') ) {
				// Default texts
				var checkOnText  = (typeof(onText) == 'undefined') ? 'ON' : onText,
					checkOffText = (typeof(offText) == 'undefined') ? 'OFF' : offText;
			   
			   // Labels structure
				var onLabel = (checkOnText) ? '<div class="switch-label switch-label-on">'+ checkOnText +'</div>' : '',
					offLabel = (checkOffText) ? '<div class="switch-label switch-label-off">'+ checkOffText +'</div>' : '';
				
				// Default states
				var disabled = ($(this).is(':disabled')) ? true : false,
					active = ($(this).is(':checked'))  ? true : false;
				
				var statusClasses = '';
				statusClasses += (active) ? ' switch-on' : ' switch-off'; 
				if (disabled) {
					statusClasses += ' switch-disable';
				}
			   
				// Wrap and append
				var structure = 
				'<div class="switcher-input '+statusClasses+'">' +
					'<div class="switch-cursor"></div>' +
					onLabel + offLabel +
				'</div>';
			   
				if ( $(this).is(':input') && ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') ) {
					$(this).wrap('<div class="switch-wrap"></div>');
					$(this).parent().append(structure);
					$(this).parent().find('.switcher-input').addClass($(this).attr('type') +'-switch');
				}
			}
        });
	};
	// Handlers
	$(document).ready(function() {
		// On click
		$(document).on('click tap', '.switcher-input:not(.switch-disable)', function(e) {
			if ( $(this).hasClass('switch-on') ) {
				// Not for radio
				if ( !$(this).hasClass('radio-switch') ) { 
					$(this).switchOff();
				}
			} else {
				$(this).switchOn();	
			}
		});
		// On checkbox status change
		$(document).on('change', '.switch-wrap input', function() {
			( $(this).is(':checked') ) ? $(this).switchOn() : $(this).switchOff();	
		});
	});
})(jQuery);