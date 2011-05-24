/* ----------------------------------------------------------------------------------
	Flaminwork Javascript Framework
	
	Version:	0.1-RC1
	Encoding:	UTF-8
	Authors:	
		Juan G. Hurtado 	[juan.g.hurtado@gmail.com]
		Álvaro Fernández 	[creativo@alvarografico.es]
-------------------------------------------------------------------------------------
	Table of contents
-------------------------------------------------------------------------------------
	1.	EXPAND BLOCKS
	2.	STYLE HELPER
	3.	CUSTOM-VIAVANSI
---------------------------------------------------------------------------------- */

if (typeof jQuery != "undefined") {
	
	/* =EXPAND BLOCKS
	---------------------------------------------------------------------------------- */
	var expand = {
		init : function() {
			jQuery('.expand-wrapper').filter(function() {
				return !jQuery(this).find('.expand-title').hasClass('closed') && !jQuery(this).find('.expand-title').hasClass('opened');
			})
			.find('.expand-body:not(.visible)').hide()
			.end().find('.expand-title:first').each(function() {
				var element = jQuery(this).parents('.expand-wrapper:first').find('.expand-body');
				if (element.css('display') == "none") {
					element.addClass('hidden');
					jQuery(this).addClass('closed');
					element.parents('.expand-wrapper:first').removeClass('current');
				}
				else {
					element.addClass('visible');
					jQuery(this).addClass('opened');
					element.parents('.expand-wrapper:first').addClass('current');
				}
			}).css('cursor','pointer')
			.bind('click',function(e) {
				var element = jQuery(this).parents('.expand-wrapper:first').find('.expand-body:first');

				jQuery(this).toggleClass('closed');
				jQuery(this).toggleClass('opened');
				
				element.toggleClass('visible');
				element.toggleClass('hidden');
				
				var fade = element.hasClass('fade');
				
				if (element.css('display') == "none") {
					element.parents('.expand-wrapper:first').toggleClass('current');
					if (fade) {
						element.fadeIn(200);
					} else {
						element.slideDown('slow');
					}
				} else {
					if (fade) {
						element.fadeOut(200, function() {
							element.parents('.expand-wrapper:first').toggleClass('current');
						});
					} else {
						element.slideUp('slow', function() {
							element.parents('.expand-wrapper:first').toggleClass('current');
						});
					}
				}
				
				e.preventDefault();
			});
		}
	};
	
	/* =STYLE HELPER
	---------------------------------------------------------------------------------- */
	var styleHelper = {

		firstLast : function(parent, child) {
			jQuery(parent).each(function() {
				jQuery(this).children(child +':first')
					.addClass('first');
				
				jQuery(this).children(child +':last')
					.addClass('last');
			});
		},
		
		evenOdd : function(parent, child) {
			jQuery(parent).each(function() {
				jQuery(this).children(child +':even')
					.addClass('odd');
				
				jQuery(this).children(child +':odd')
					.addClass('even');
			});
		},
		
		addHover : function(elements) {
			jQuery(elements).hover(function() {
				jQuery(this).addClass('hover');
			}, function() {
				jQuery(this).removeClass('hover')
			});
		}
	};
	
	/* =Funciones relativas a las tablas
	---------------------------------------------------------------------------------- */
	var tables = {
			
		init : function() {
			tables.iconGroup.init();
			tables.confirm.init();
		},
				
		iconGroup : {
			
			deleteWrappers : function() {
				jQuery('table tbody tr td span.icon-grouped-wrapper span.icon-grouped-links:visible').fadeOut();
			},
			
			init : function() {
				jQuery('table tbody td .icon-group').show().each(function() {
					if (jQuery(this).find('.icon-grouped-wrapper').length) {
						return;
					}
					
					jQuery(this).children()
						.wrapAll('<span class="icon-grouped-wrapper"><span class="icon-grouped-links"></span></span>')
						.wrap('<span class="icon-grouped-item"></span>')
						.end()
						.find('span.icon-grouped-wrapper span.icon-grouped-links').hide()
						.end().find('span.icon-grouped-wrapper')
						.append(jQuery('<span class="ui-icon ui-icon-circle-triangle-s icon-grouped-trigger"></span>').css('cursor','pointer'))
						.end()
						.find('span.icon-grouped-trigger').css({
							outline : 'none'
						}).bind('click', function(e) {
							tables.iconGroup.deleteWrappers();
							
							var $groupedLinks = jQuery(this).prev('span.icon-grouped-links');
							
							if ($groupedLinks.is(':visible')) {
								$groupedLinks.fadeOut();
							} else {
								$groupedLinks.fadeIn();
							}
							
							e.preventDefault();
							e.stopPropagation();
							
							jQuery(document).bind('click', function() {
								tables.iconGroup.deleteWrappers();
								jQuery(document).unbind('click');
							});
						});
				});
			}
		},
		
		confirm : {
			
			// Config
			fadeTimer			: 250,
			blockClass 			: 'confirm-block',
			wrapperClass 		: 'confirm-block-wrapper',
			acceptClass 		: 'confirm-accept',
			cancelClass 		: 'confirm-cancel',
			textClass 			: 'confirm-text',
			defaultSelector 	: 'table tbody tr td .confirm',
			defaultText 		: '¿Está seguro?',
			defaultAcceptText 	: 'Sí',
			defaultCancelText 	: 'No',
			
			// Method to fade and remove all existing wrappers
			deleteWrappers : function() {
				jQuery('.'+ tables.confirm.wrapperClass).fadeOut(tables.confirm.fadeTimer, function() {
					jQuery(this).remove();
				});
			},
			
			init : function(selector) {
				selector = selector!=null && selector!=''?selector:tables.confirm.defaultSelector;
				
				// Loop through not processed items
				jQuery(selector +':not(.processed)').each(function() {
					
					// Mark as processed
					var $element = jQuery(this).addClass('processed');
					
					// On item click...
					$element.bind('click', function(e) {
						
						// (*) Delete iconGroup bubbles
						if (typeof tables != "undefined") {
							tables.iconGroup.deleteWrappers();
						}
						
						// 1.- Delete all existing wrappers
						tables.confirm.deleteWrappers();
						
						// 2.- Get parent TR and TD
						var $tr = jQuery(this).parents('tr:first'),
							$td = jQuery(this).parents('td:first'),
						
						// 3.- Define styles for wrapper and block (positioning, dimensions, blah blah blah...)
						divStyles = {
							height 		: ($tr.height() + 2) +'px',
							left 		: ($tr.offset().left - 1) +'px',
							position 	: 'absolute',
							top 		: ($tr.offset().top) +'px',
							width 		: ($tr.width() + 2) +'px'
						},
						
						confirmBlockStyles = {
							height : ($tr.height() + 2) +'px',
							position : 'absolute',
							right : '0',
							top : '-1px',
							width : ($td[0].clientWidth + 20) + 'px'
						},
						
						// 4.- Create wrapper
						$confirmBlock = jQuery('<div />')
							.addClass(tables.confirm.blockClass)
							.css(confirmBlockStyles)
							
							// TEXT
							.append(
								jQuery('<span />')
									.addClass(tables.confirm.textClass)
									.text($element.attr('title')!=''?$element.attr('title'):tables.confirm.defaultText)
							)
							
							// CANCEL
							.append(jQuery('<a href="#" />')
									.text(tables.confirm.defaultCancelText)
									.addClass(tables.confirm.cancelClass)
									.bind('click', function(e) {
										// On "cancel" click: Delete all wrappers
										tables.confirm.deleteWrappers();
								
										e.preventDefault();
									}))
							
							// ACCEPT
							.append(jQuery('<a />')
									// Attach original behaviour to "accept" link
									.attr('href', $element.attr('href')!=null?$element.attr('href'):'#')
									.addClass(tables.confirm.acceptClass)
									.text(tables.confirm.defaultAcceptText)
									.bind('click', function(e) {
										if ($element.is('button') || $element.is('input')) {
											$element.unbind('click').click();
											e.preventDefault();
										}
									})
							);
						
						// 5.- Append wrapper to the body
						$div = jQuery('<div />')
							.addClass(tables.confirm.wrapperClass)
							.css(divStyles)
							.hide()
							.append($confirmBlock)
							.appendTo('body')
							.fadeIn(tables.confirm.fade);
						
						// 6.- Avoid default behaviour and bubbling
						e.preventDefault();
						e.stopPropagation();
						
						// 7.- Delete all existing "delete-block-wrapper" clicking anywhere on the document
						jQuery(document).bind('click', function() {
							tables.confirm.deleteWrappers();
						});
					});
				});
			}			
		}
		
	}
	
	
	/* =CUSTOM-VIAVANSI
	---------------------------------------------------------------------------------- */
	var framework = {
			
		init : function() {
			/* Inicialización de la funcionalidad del styleHelper
			para añadir las clases CSS "first" y "last" */
			styleHelper.firstLast('ul','li');
			styleHelper.firstLast('ol','li');
			styleHelper.firstLast('dl','dt');
			styleHelper.firstLast('dl','dd');
			styleHelper.firstLast('table','tr');
			
			/* Inicialización de la funcionalidad del styleHelper
				para añadir la clase CSS "odd" a elementos pares */
			styleHelper.evenOdd('ul','li');
			styleHelper.evenOdd('table tbody','tr');
			
			/* Inicialización de la funcionalidad del styleHelper
				para añadir la clase CSS "hover" a elementos por
				los que pasemos por encima con el ratón */
			styleHelper.addHover('li');
			styleHelper.addHover('table tbody tr');
			
			/* Añadimos el class="js" al BODY para saber que tenemos JS */
			jQuery('body:not(.js)').addClass('js');
			
			/* Inicializamos los expansores */
			expand.init();
			
			/* Eliminamos los botones de jQuery-ui de los botones con class="ui-link" */
			if (typeof jQuery.fn.button != "undefined") {
				jQuery('button.ui-link').css({
					height: 'auto',
					visibility: 'visible',
					width: 'auto'
				}).removeClass('ui-state-default');
				
				var cssClass = jQuery('button.ui-link').attr('class');
				
				try{
					jQuery('button.ui-link').button('destroy');
					
					jQuery('button.ui-link').each(function() {
						var reg = jQuery(this).attr('class').match(/ui-icon-([^\s]*)/);
						var icon = reg?reg[0]:'';
						
						
						if (icon != "" && jQuery(this).find('.ui-icon').length <= 0) {
							jQuery(this).prepend('<span class="ui-icon '+ icon +'"></span>');
						}
					}).show();
				} catch(e) {}
			}
			
			/* Estilizamos los enlaces con class="ui-button" como botones, controlando si deben tener iconos */
			if (typeof jQuery.fn.button != "undefined") {
				jQuery('a').filter('.ui-button').each(function() {
					var reg = jQuery(this).attr('class').match(/ui-icon-([^\s]*)/);
					var icon = reg?reg[1]:'';
					var icononly = jQuery(this).hasClass('ui-button-icon-only');
					
					if (icon != "") {
						jQuery(this).button({
							text : !icononly,
							icons: {
								primary: "ui-icon-"+ icon
							}
						});
					} else {
						jQuery(this).button();
					}
				});
				
				jQuery('.ui-tabs-panel button.ui-link').hover(function() {
					jQuery(this).removeClass('ui-state-hover');
				},function() {
					jQuery(this).removeClass('ui-state-hover');
				}).find('.ui-button-text').remove();
			}
			
			/* Inicialización de la funcionalidad de las tablas */
			tables.init();
			
			/* Formateo numérico */
			if (typeof jQuery.fn.parseNumber == "function") {
				jQuery('input.formatNumber').bind('blur', function() {
					jQuery(this).parseNumber({format:"#,###.##", locale:LOCALE});
					jQuery(this).formatNumber({format:"#,###.##", locale:LOCALE});
				}).each(function() {
					jQuery(this).parseNumber({format:"#,###.##", locale:LOCALE});
					jQuery(this).formatNumber({format:"#,###.##", locale:LOCALE});
				});
			};
		}
	};
	
}

/* Framework para componentes JSF */
function handleComplete(xhr, status, args,f) {
	var isValid = args.isValid;
	var validationFailed =args.validationFailed;
	if(isValid || (isValid ==undefined && !validationFailed)){
		f();
	}
}