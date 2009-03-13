/*
Class: Menu

Syntax:
	(start code)
	new Menu( options );
	(end)
	
Options:	
 items - (object) An object containing the item name followed by a function to execute when the item is clicked.(Required)
 element - (string) The id of the element this menu is to be attached to. (Required)
 button - The mouse button to be triggered on. Valid values are 'left' and 'right'. Defaults to 'left'.
 shift - (boolean) whether or not the shift key should be pressed to trigger the menu. Defaults to false.
 alt - (boolean) whether or not the alt key should be pressed to trigger the menu. Defaults to false.
 control - (boolean) whether or not the ctrl key should be pressed to trigger the menu. Defaults to false.
 meta - (boolean) whether or not the meta key should be pressed to trigger the menu. Defaults to false.
 
Example:
 	(start code)
 		new Menu({
			items: {
			"foo": function( ){ MochaUI.notification( 'foo!' ) },
			bar: function( ){ MochaUI.notification( 'bar!' ) }
			},
			element: "toolBox",
			button: 'left',
			shift: false,
			alt: false,
			control: true,
			meta: false
		});
	(end)
 
Known problems:
	Context menus (right click) cannot be disabled on Opera or Chrome, and therefore two menus appear when button is set to 'right' on those browsers
	Setting meta to true disables the menus on at least some versions of IE6. (event.meta always seems to be 'undefined' in my tests on win2k+IE6)
	IE6 reacts strangely on ctrl+click and shift+click by highlighting portions of the page.
*/

menuCounter = 0;
MochaUI.PopupMenu = new Class({
	Implements: Options,
	options: {
		items: { },
		button: "left",
		shift: false,
		alt: false,
		control: false,
		meta: false
	},
	
	initialize: function( options )
	{
		this.setOptions( options );
		MochaUI.PopupMenu.addCSS( );
		if ( !$( 'menuHolder' ) )
			document.body.appendChild( document.createElement( 'div' ) ).id = 'menuHolder';
		if ( !menuCounter )
		{ // close any open menus when the mouse is pressed.
			$$( 'body' ).addEvent( 'mousedown', function( )
			{
				menus = $( 'menuHolder' ).childNodes;
				for ( i=0; i < menus.length; i++ )
				{
					menus[ i ].style.display = "";
				}
			});
		}
		var menu = document.createElement( 'ul' );
		menu.id = "clickMenu" + menuCounter++;
		menu.className = "clickMenu";
		var menuOptions = {
				rightClick: ( options.button == 'right' ),
				shift: Boolean( options.shift ),
				alt: Boolean( options.alt ),
				control: Boolean( options.control ),
				meta: Boolean( options.meta )
		}
		if ( options.title )
		{
			title = document.createElement( 'li' )
			title.className = 'title';
			title.appendChild( document.createTextNode( options.title ) );
			menu.appendChild( title );
		}
		for ( var i in this.options.items )
		{
			var item = document.createElement( 'li' );
			item.className = "menuItem"; 
			item.appendChild( document.createTextNode( i ) );
			item.onclick = this.options.items[ i ];
			menu.appendChild( item );
		}
		$( 'menuHolder' ).appendChild( menu );
		$(menu.id).addEvent( 'mouseup', function( ){ 
			menu.style.display="none";
		});
		if ( menuOptions.rightClick )
		{
			$( this.options.element ).addEvent( 'contextmenu', function(){ dispatchCtxMenuEvent(e, 'contextmenu'); return false;} )
		}
		$( this.options.element ).addEvent( 'mouseup', function( e )
			{
				if	(  e.rightClick == menuOptions.rightClick
					&& e.shift == menuOptions.shift
					&& e.alt == menuOptions.alt
					&& e.control == menuOptions.control
//					&& Boolean( e.meta ) == menuOptions.meta
				)
				{
					menu.style.top = ( e.page.y ) + "px";
					menu.style.left = ( e.page.x - 16 ) + "px";
					menu.style.display = "block";
				}
			});
		helpers.fixIEHover( menu );
		$$('#'+menu.id+' li.menuItem').each( helpers.fixIEHover )
		return this;
	}
});// MochaUI.PopupMenu

MochaUI.PopupMenu.addCSS = function( )
{
	if ( !MochaUI.PopupMenu.CSS )
	{
		MochaUI.PopupMenu.CSS = new Asset.Style({ priority: 0 });
		MochaUI.PopupMenu.CSS.addRules({

			'.clickMenu.hover, .clickMenu:hover': {
				'display': 'block'
			},

			'.clickMenu li': {
				'list-style-type': 'none',
				'padding': '0 10px',
				'cursor': 'pointer'
			},
			'.clickMenu li.title': {
				'font-weight': 'bold',
				'border-bottom': '1px solid black',
				'position': 'relative',
				'top': '-5px',
				'background-color': '#ddd'
			},
			
			'.clickMenu li.menuItem.hover, .clickMenu li.menuItem:hover': {
					'background-color': '#ddd'
			}
		});
	}
}

