/*

This file contains tweaks to MochaUI.closeAll( )

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
