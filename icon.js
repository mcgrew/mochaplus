/*

Script: icon.js
	Create Desktop Icons on the virtual desktop

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
	onDestroy - A function to be executed when the icon is removed with icon.destroy( )
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
	Implements: Options,
	options: { 
		id: null,
		title: null,
		container: null,
		image: null
	},
	initialize: function( options )
	{
		this.setOptions( options );
		MochaUI.Icon.addCSS( );
		var desktop = ( this.options.container ) ? $( this.options.container ) : $( 'page' );
		var div = document.createElement( 'div' );
		var img = document.createElement( 'img' );
		var span = document.createElement( 'span' );
		this.options.id = div.id = ( this.options.id ) ? this.options.id : "icon" + iconCount++;
		div.className ="desktopIcon";
		img.src = this.options.image;
		img.style.width = "48px";
		img.style.height = "48px";
		img.id = this.options.title + "_icon";
		span.className = "iconTitle";
		span.appendChild( document.createTextNode( this.options.title ) );
		$(span).addEvent( 'click', this.rename.bind( this ));
		div.appendChild( img );
		div.appendChild( document.createElement( 'br' ) );
		div.appendChild( span );
		desktop.appendChild( div );
		if ( Browser.Engine.trident4 && /\.png$/.test( this.options.image ) )
			fixPNG( img );
		this.container = div;
		this.imgTag = img;
		this.titleDisplay = span;
	},
	set: function( option, value ){
		if ( this.options[ option ] )
			this.options[ option ] = value;
		if ( option == 'id' )
			this.container.id = value;
		if ( option == 'image' )
			this.imgTag.src = value;

	},
	rename: function( )
	{
		var desktop = document.getElementById( 'page' );
		var input = document.createElement( 'input' );
		var doRename = function( e )
		{
			this.options.title = input.value;
			this.container.removeChild( input );
			while ( this.titleDisplay.firstChild )
				this.titleDisplay.removeChild( this.titleDisplay.firstChild );
			this.titleDisplay.appendChild( document.createTextNode( this.options.title ) );
			this.titleDisplay.style.display = "";
			if ( this.onRename )
				this.onRename( );
		}.bind( this );
		var cancelRename = function( e )
		{
			this.container.removeChild( input );
			this.titleDisplay.style.display = "";
		}.bind( this );
		input.type = 'text';
		this.titleDisplay.style.display = "none";
		this.container.appendChild( input );
		$(input).addEvent( 'blur', doRename )
		$(input).addEvent( 'keypress', function( e ){ 
			if ( e.key == 'enter' ) doRename( e );
			if ( e.key == 'esc' ) cancelRename( e );
		});
		input.value = this.options.title;
		input.select( );
	},

	destroy: function( )
	{
		if ( this.onDestroy )
			this.onDestroy( );
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
				'margin': '15px 0 0 15px'
			},

			'.desktopIcon img': {
				'padding': '0 24px',
				'cursor': 'pointer'	
			},

			'.desktopIcon .iconTitle': {
				'cursor': 'text'
			},

			'.desktopIcon input': {
				'background-color': 'transparent',
				'color': '#3F3F3F',
				'border': 'none'
			}
		});
	}
	
}


