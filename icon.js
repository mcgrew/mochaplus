/*

Script: Icon.js
	Create Desktop Icons on the virtual desktop

Copyright:
	Copyright (c) 2008 Thomas McGrew, <http://ecolicommunity.org>.

License:
	MIT-style license.

Requires:
	Core.js
*/

/*

Class: Icon
	Creates an Icon on the desktop.

Syntax:
	(start code)
	new MochaUI.Icon( options )
	(end)

Arguments:
	options

Options:
	id - The id of the icon container element. If not defined, it will be set to "icon" + iconCount
	title - The title for the icon. This will be printed below the image.	
	image - The image to use for the icon. This is set up to use 48x48 icons.
	container - The element the icon should be placed inside of. Defaults to $('page') (the desktop) if not specified.
	onRename - A function to be executed when the icon title is changed with icon.rename( )
	onRemove - A function to be executed when the icon is remove with icon.remove( )
	onClick - A function to be executed when the icon image is clicked.
	
Returns:
	An Icon object

Example:
	var docIcon = new Icon({
		id: "docIcon",
		title: "My Documents",
		image: "images/icons/48x48/globe.png",
		container: "page",
		onClick: function( ) { MochaUI.notification( "Ouch!" ); },
		onRename: function( ) { MochaUI.notification( "You shall no longer call me by my old name" ); },
		onDelete: function( ) { MochaUI.notification( "I'm melting, I'm melting..." ); }
	});
		

*/
var iconCount = 0;
MochaUI.Icon = new Class({
	initialize: function( options )
	{
		if ( !options ) options = { };
		MochaUI.Icon.addCSS( );
		this.title =  ( options.title ) ? options.title : "";
		var desktop = ( options.container ) ? $( options.container ) : $( 'page' );
		var div = document.createElement( 'div' );
		var img = document.createElement( 'img' );
		var span = document.createElement( 'span' );
		div.id = ( options.id ) ? options.id : "icon" + iconCount++;
		div.className ="desktopIcon";
		img.src = options.image;
		img.style.width = "48px";
		img.style.height = "48px";
		img.id = this.title + "_icon";
		span.className = "iconTitle";
		span.appendChild( document.createTextNode( options.title ) );
		div.appendChild( img );
		div.appendChild( document.createElement( 'br' ) );
		div.appendChild( span );
		desktop.appendChild( div );
		if ( Browser.Engine.trident4 && /\.png$/.test( options.image ) )
			fixPNG( img );
		this.container = div;
		this.imgTag = img;
		this.titleDisplay = span;
		if ( options.onRename )
			this.onRename = options.onRename;
		if ( options.onDelete )
			this.onDelete = options.onDelete;
		if ( options.onClick )
			this.addEvent( 'click', options.onclick );
	},

	rename: function( )
	{
		var desktop = document.getElementById( 'page' );
		var icon = this;
		var input = document.createElement( 'input' );
		var doRename = function( e )
		{
			icon.title = input.value;
			icon.container.removeChild( input );
			while ( icon.titleDisplay.firstChild )
				icon.titleDisplay.removeChild( icon.titleDisplay.firstChild );
			icon.titleDisplay.appendChild( document.createTextNode( icon.title ) );
			icon.titleDisplay.style.display = "";
			if ( icon.onRename )
				icon.onRename( );
		};
		var cancelRename = function( e )
		{
			icon.container.removeChild( input );
			icon.titleDisplay.style.display = "";
		};
		input.type = 'text';
		this.titleDisplay.style.display = "none";
		this.container.appendChild( input );
		$(input).addEvent( 'blur', doRename )
		$(input).addEvent( 'keypress', function( e ){ 
			if ( e.key == 'enter' ) doRename( );
			if ( e.key == 'esc' ) cancelRename( );
		});
		input.value = this.title;
		input.select( );
	},

	remove: function( )
	{
		if ( this.onRemove )
			this.onRemove( );
		$('page').removeChild( this.container );
	},

	addEvent: function( type, call )
	{
		this.imgTag.addEvent( type, call );
	}
});//Icon

MochaUI.Icon.addCSS = function( )
{
	if ( !MochaUI.Icon.CSS ) 
	{
		MochaUI.Icon.CSS = new Asset.Style({ priority: 0 })
		MochaUI.Icon.CSS.addRules({
			'.desktopIcon': {
				'float': 'left',
				'width': '96px',
				'padding': '0 10px',
				'text-align': 'center',
				'margin': '15px 0 0 15px',
				'cursor': 'pointer'	
			},

			'.desktopIcon img': {
				'padding': '0 24px'
			},

			'.desktopIcon input': {
				'background-color': 'transparent',
				'color': '#3F3F3F',
				'border': 'none'
			}
		});
	}
	
}


