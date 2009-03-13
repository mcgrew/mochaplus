/*
Class: Menu

Syntax:
	(start code)
	new Menu( options );
	(end)
	
Options:	
 title - The optional title to be displayed on the top of the menu. Default to a menu with no title.
 items - (object) An object containing the item name followed by a function to execute when the item is clicked.(Required)
 element - (string) The id of the element this menu is to be attached to. (Required)
 button - The mouse button to be triggered on. Valid values are 'left' and 'right'. Defaults to 'left'.
 shift - (boolean) whether or not the shift key should be pressed to trigger the menu. Defaults to false.
 alt - (boolean) whether or not the alt key should be pressed to trigger the menu. Defaults to false.
 control - (boolean) whether or not the ctrl key should be pressed to trigger the menu. Defaults to false.
 meta - (boolean) whether or not the meta key should be pressed to trigger the menu. Defaults to false.
 width - (number) the width of the menu, or 0 for auto width. defaults to 0.
 baseElement - The element the menu should be placed relative to. Defaults to the mouse cursor.
 offsetX - The X offset from the baseElement the menu should be positioned.
 offsetY - The Y offset from the baseElement the menu should be positioned.
 
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

To Do:
	Add multilevel menu support.
*/

menuCounter = 0;
MochaUI.PopupMenu = new Class({
	Implements: Options,
	options: {
		title: false,
		element: document,
		items: { },
		button: "left",
		shift: false,
		alt: false,
		control: false,
		meta: false,
		baseElement: false,
		offsetX: 0,
		offsetY: 0,
		width: 0
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
		this.menuEl = document.createElement( 'ul' );
		this.menuEl.id = "clickMenu" + menuCounter++;
		this.menuEl.className = "clickMenu";
		if ( this.options.width ) this.menuEl.setStyles({ 'width':this.options.width });
		var menuOptions = {
				rightClick: ( options.button == 'right' ),
				shift: Boolean( options.shift ),
				alt: Boolean( options.alt ),
				control: Boolean( options.control ),
				meta: Boolean( options.meta )
		}
		if ( this.options.title )
		{
			title = document.createElement( 'li' )
			title.className = 'title';
			title.appendChild( document.createTextNode( options.title ) );
			this.menuEl.appendChild( title );
		}
		for ( var i in this.options.items )
		{
			var item = new Element( 'li' );
			item.className = "menuItem"; 
			item.set({ id:this.menuEl.id+i });
			item.appendChild( document.createTextNode( i ) );
			this.menuEl.appendChild( item );
			item.addEvent( 'mouseup', this.options.items[ i ] );
		}
		$( 'menuHolder' ).appendChild( this.menuEl );
		$(this.menuEl).addEvent( 'mouseup', this.hide.bind( this ) );
		if ( menuOptions.rightClick )
		{
			$( this.options.element ).addEvent( 'contextmenu', function(){ dispatchCtxMenuEvent(e, 'contextmenu'); e.stop( )} )
		}
		$( this.options.element ).addEvent( 'click', function( e )
		{
			if	(  
				e.rightClick == menuOptions.rightClick
				&& e.shift == menuOptions.shift
				&& e.alt == menuOptions.alt
				&& e.control == menuOptions.control
//				&& Boolean( e.meta ) == menuOptions.meta
			){
				var delay = 1000;
//				if ( !e.rightClick ) delay = 100;
				this.show( e.page );	
			}
		}.bind( this ));
		this.options.element.addEvent( 'dblclick', function( ){
			this.hide( );
		}.bind( this ));
		this.menuEl.fixIEHover( );
		this.menuEl.getElements( 'li.menuItem' ).each( function( el ){
			$(el).fixIEHover( );
		});
		return this;
	},
	show: function( mousePosition )
	{
		var basePosition;
		if ( !$(this.options.baseElement) ) { 
			if ( mousePosition )
			{
				basePosition = mousePosition;
				basePosition.x -= 16;
			}
			else
				basePosition = { x: 0, y: 0 }
		}
		else basePosition = $(this.options.baseElement).getPosition( );
		this.menuEl.setStyles({ 
			'left':	basePosition.x + this.options.offsetX,
			'top' : basePosition.y + this.options.offsetY,
			'display': 'block'
		});
	},
	hide: function( )
	{
			this.menuEl.setStyles({ 'display': 'none' });
	},
	disable: function( item )
	{
		var itemEl = this.menuEl.getElement( 'li#'+this.menuEl.id+item )
		if ( itemEl )
		{
			itemEl.addClass( 'disabled' );
			itemEl.removeEvents( 'click' );
		}
	},
	enable: function( item )
	{
		var itemEl = this.menuEl.getElement( 'li#'+this.menuEl.id+item )
		if ( itemEl )
		{
			itemEl.removeClass( 'disabled' );
			itemEl.removeEvents( 'click' );
			itemEl.addEvent( 'click', this.options[ item ] );
		}
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
			'.clickMenu li.disabled': {
				'color': '#aaa'
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
			},
			'.clickMenu li.menuItem.disabled.hover, .clickMenu li.menuItem.disabled:hover': {
					'background-color': 'transparent'
			}
		});
	}
}

