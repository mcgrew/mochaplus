/*

Script: Enhancements.js
	Enhancements to the MochaUI Window api:
		close( )
		restore( )
		minimize( )
		maximize( )
	also hideSpinner( ) and showSpinner( ) no longer require an argument.

	This file also contains tweaks to:
		MochaUI.closeAll( )
		MochaUI.arrangeCascade( )
		MochaUI.arrangeTile



*/



MochaUI.extend({
	closeAll: function( )
	{
		this.Windows.instances.each(function(window_){
			if ( window_.options.closable )
				this.closeWindow( $(window_.options.id) );
		}.bind(this));
	},


	arrangeCascade: function( )
	{
		// See how much space we have to work with
		var coordinates = document.getCoordinates();
		
		var openWindows = 0;
		MochaUI.Windows.instances.each(function(instance){
			if (!instance.isMinimized && instance.options.draggable) openWindows ++; 
		});
		
		if ((this.options.windowTopOffset * (openWindows + 1)) >= (coordinates.height - this.options.viewportTopOffset)) {
			var topOffset = (coordinates.height - this.options.viewportTopOffset) / (openWindows + 1);
		}
		else {
			var topOffset = this.options.windowTopOffset;
		}
		
		if ((this.options.windowLeftOffset * (openWindows + 1)) >= (coordinates.width - this.options.viewportLeftOffset - 20)) {
			var leftOffset = (coordinates.width - this.options.viewportLeftOffset - 20) / (openWindows + 1);
		}
		else {
			var leftOffset = this.options.windowLeftOffset;
		}

		var x = this.options.viewportLeftOffset;
		var y = this.options.viewportTopOffset;
		$$('div.mocha').each(function(windowEl){
			var currentWindowClass = MochaUI.Windows.instances.get(windowEl.id);
			if (!currentWindowClass.isMinimized && !currentWindowClass.isMaximized && currentWindowClass.options.draggable){
				id = windowEl.id;
				MochaUI.focusWindow(windowEl);
				x += leftOffset;
				y += topOffset;

				if (MochaUI.options.useEffects == false){
					windowEl.setStyles({
						'top': y,
						'left': x
					});
				}
				else {
					var cascadeMorph = new Fx.Morph(windowEl, {
						'duration': 550
					});
					cascadeMorph.start({
						'top': y,
						'left': x
					});
				}
			}
		}.bind(this));
	},

	arrangeTile: function(){
		var x = 10;
		var y = 10;
	
		var instances =  MochaUI.Windows.instances;

		var windowsNum = 0;

		instances.each(function(instance){
			if (!instance.isMinimized && !instance.isMaximized){
				windowsNum++;
			}
		});

		var cols = 3;
		var rows = Math.ceil(windowsNum / cols);
		
		var coordinates = document.getCoordinates();
	
		var col_width = ((coordinates.width - this.options.viewportLeftOffset) / cols);
		var col_height = ((coordinates.height - this.options.viewportTopOffset) / rows);
		
		var row = 0;
		var col = 0;
		
		instances.each(function(instance){
			if (!instance.isMinimized && !instance.isMaximized && instance.options.draggable ){
				
				var content = instance.contentWrapperEl;
				var content_coords = content.getCoordinates();
				var window_coords = instance.windowEl.getCoordinates();
				
				// Calculate the amount of padding around the content window
				var padding_top = content_coords.top - window_coords.top;
				var padding_bottom = window_coords.height - content_coords.height - padding_top;
				var padding_left = content_coords.left - window_coords.left;
				var padding_right = window_coords.width - content_coords.width - padding_left;

				/*

				// This resizes the windows
				if (instance.options.shape != 'gauge' && instance.options.resizable == true){
					var width = (col_width - 3 - padding_left - padding_right);
					var height = (col_height - 3 - padding_top - padding_bottom);

					if (width > instance.options.resizeLimit.x[0] && width < instance.options.resizeLimit.x[1]){
						content.setStyle('width', width);
					}
					if (height > instance.options.resizeLimit.y[0] && height < instance.options.resizeLimit.y[1]){
						content.setStyle('height', height);
					}

				}*/

				var left = (x + (col * col_width));
				var top = (y + (row * col_height));

				instance.windowEl.setStyles({
					'left': left,
					'top': top
				});

				instance.drawWindow(instance.windowEl);

				MochaUI.focusWindow(instance.windowEl);

				if (++col === cols) {
					row++;
					col = 0;
				}
			}
		}.bind(this));
	}
});

MochaUI.Window.implement({
	/*

	Function: hideSpinner
		Hides the spinner.
		
	*/	
	hideSpinner: function(spinner) {
		if (!this.options.useSpinner || this.options.shape == 'gauge' || this.options.type == 'notification') return;
		if ( !spinner )
		{
			if ( this.desktop )
				spinner = 'spinner';
			else
				spinner = this.options.id+'_spinner';
		}
		if ($(spinner))	$(spinner).setStyle('visibility', 'hidden');
	},
	/*

	Function: showSpinner
		Shows the spinner.
	
	*/	
	showSpinner: function(spinner){
		if (!this.options.useSpinner || this.options.shape == 'gauge' || this.options.type == 'notification') return;
		if ( !spinner )
		{
			if ( this.desktop )
				spinner = 'spinner';
			else
				spinner = this.options.id+'_spinner';
		}
		$(spinner).setStyles({
			'visibility': 'visible'
		});
	},
	/* 

	 Function: close
		Closes the window.
		
	 */
	close: function( ) {
		if ( !this.isClosing )
			MochaUI.closeWindow( $(this.options.id) );
		return this;
	},
	/*

	 Function: minimize
		Minimizes the window.

	 */
	minimize: function( ) {
		MochaUI.Dock.minimizeWindow( $(this.options.id) )
		return this;
	},
	/*

	 Function: maximize
		Maximizes the window.

	 */
	maximize: function( ) {
		if ( this.isMinimized )
			MochaUI.Dock.restoreMinimized( $(this.options.id) );
		MochaUI.Desktop.maximizeWindow( $(this.options.id) );
		return this;
	},
	/*

	 Function restore
		Restores a minimized/maximized window to its original size.

	 */
	restore: function( ) {
		if ( this.isMinimized )
			MochaUI.Dock.restoreMinimized( $(this.options.id) );
		else if ( this.isMaximized )
			MochaUI.Desktop.restoreWindow( $(this.options.id) );
		return this;
	}

});
