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
	},

});
