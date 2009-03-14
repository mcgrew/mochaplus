/* 

Script: enhancements.js
	This file contains functions which override or add functionality to
	portions of mocha(ui)

License:
	MIT license.

	Copyright (c) 2009 Thomas McGrew

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

*/



MochaUI.extend({
	closeAll: function( )
	{
		this.Windows.instances.each(function(window_){
			if ( window_.options.closable )
				this.closeWindow( $(window_.options.id) );
		}.bind(this));
	}

});

MochaUI.Window.implement({
	attachDraggable: function(windowEl){
		if (!this.options.draggable) return;
		this.windowDrag = new Drag.Move(windowEl, {
			handle: this.titleBarEl,
			container: this.options.restrict == true ? $(this.options.container) : false,
			grid: this.options.draggableGrid,
			limit: this.options.draggableLimit,
			snap: this.options.draggableSnap,
			onStart: function() {
				if (this.options.type != 'modal' && this.options.type != 'modal2'){ 
					MochaUI.focusWindow(windowEl);
					$('windowUnderlay').setStyle('display','block');
					windowEl.addClass( 'dragging' );
				}
				if ( this.iframeEl )
					this.iframeEl.setStyle('visibility', 'hidden');
			}.bind(this),
			onComplete: function() {
				if (this.options.type != 'modal' && this.options.type != 'modal2') {
					$('windowUnderlay').setStyle('display', 'none');
					windowEl.removeClass( 'dragging' );
				}
				if ( this.iframeEl ){
					this.iframeEl.setStyle('visibility', 'visible');
				}
				// Store new position in options.
				this.saveValues();
			}.bind(this)
		});
	}
});
