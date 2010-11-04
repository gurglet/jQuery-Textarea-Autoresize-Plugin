/*
* jquery.autoresize v 1.00
*
* Copyright (c) 2010 Gustaf Hansen (gustaf.hansen@gmail.com)
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
*/
(function($) {
	var defaultOptions = {
		onresize: function() {}, // Callback to call 
		buffer: 1, // Number of extra rows to display
		minRows: 4, // Minimum amount of rows to display
		animate: true,
		animationDuration: 50,
		resizeOnStart: false // Set to true if you want to resize
							 // before the user selects the textarea
	};
	
	$.fn.autoresize = function(options) {
		return this.each(function() {
			var _options = $.extend({}, defaultOptions, options || {});
			
			var textarea = $(this).css({'overflow-y': 'hidden'}),
				clone = (function() {
					var css = {
						position: 'absolute',
						top: -9999,
						left: -9999
					};
					$.each(['height', 'width', 'lineHeight', 'letterSpacing', 'fontFamily', 'fontSize', 'fontWeight'],
					function(i, a) {
						css[a] = textarea.css(a);
					});
					
					return textarea.clone().css(css).removeAttr('id').removeAttr('name').attr('tabIndex', '-1').appendTo($('body'));
				})(),
				oneline = (function() {
					// Add lines of text to the clone and catch the height of one row of text
					var origText = clone.val();
					
					var line_height = 13;
					clone.val("");
					for (var i = 0; i < 10; i++) {
						clone.val(clone.val()+"\n");
						clone.scrollTop(10000);
						if (clone.scrollTop() > 0) {
							line_height = clone.scrollTop();
							break;
						}
					}
					
					clone.val(origText);
					return line_height;
				})(),
				last_height = null,
				eventListener = function () {
					clone.val(textarea.val()).scrollTop(10000);
					
					var height = Math.max(clone.height()+clone.scrollTop()+_options.buffer*oneline, _options.minRows*oneline);
					
					if (height !== last_height) {
						textarea.scrollTop(0);
						if (_options.animate) {
							$(this).animate({'height': height}, _options.animationDuration, function() { _options.onresize.call(this); });
						} else {
							textarea.height(height);
							_options.onresize.call(this);
						}
						last_height = height;
					}
				};
			
			textarea.unbind('.autoresize')
					.bind('focus.autoresize', eventListener)
					.bind('change.autoresize', eventListener)
					.bind('keyup.autoresize', eventListener)
					.bind('keydown.autoresize', eventListener);
			
			if (_options.resizeOnStart) {
				textarea.keydown();
			}
		});
	};
})(jQuery);
