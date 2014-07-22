;(function ( $ ) {
	'use strict';

	$.amSlider = function( element, options ) {
		this.options = {};
		this.el = $(element);
		this.el.data('amSlider', this);

		// Public functions
		/**
		 * Initialise the plugin
		 * @param  {string} element
		 * @param  {object} options
		 * @return {n/a}
		 */
		this.init = function(element, options) {
			var self = this;

			self.options = $.extend({}, $.amSlider.defaultOptions, options);
			options = self.options;

			// Base variables needed to run the slider
			self.slideContainer = self.el.children(options.slideContainer);
			self.slides = $(self.slideContainer).find(options.slideElement);
			self.numSlides = self.slides.length; // Total number of slides
			self.isAnimating = false; // Checking if the slider is currently animating
			self.isPlaying = false;
			self.current = 0; // Current slide showing
			self.setInterval = null; // Interval between slides

			// Detecting CSS transition support
			self.transitionSupport = false;
			self.domPrefixes = 'webkit Webkit Moz O ms Khtml'.split(' ');

			if(checkTransitionSupport(self.domPrefixes)) self.transitionSupport = true;
			// console.log(self.transitionSupport);

			// Append the extra items needed
			if(options.directionControls && self.numSlides > 1) appendDirectionControls(element, options);
			if(options.navControls && self.numSlides > 1) appendNavControls(element, options);

			this.initSlides();
			this.initEvents();
		};

		/**
		 * Initialise all interaction events
		 * @return {n/a}
		 */
		this.initEvents = function() {
			var self = this;

			if(self.options.autoPlay && self.numSlides > 1) self.play();
			if(self.options.pauseOnHover && self.options.autoPlay) {
				self.el.hover(function() {
					self.pause();
				}, function() {
					self.play();
				});
			}

			$('.am-prev').click(function(event) {
				event.preventDefault();
				self.slide('prev');
			});

			$('.am-next').click(function(event) {
				event.preventDefault();
				self.slide('next');
			});

			$('.am-tab').click(function(event) {
				event.preventDefault();
				var tabIndex = $(this).index();
				self.slide(tabIndex);
			});

			$('.am-pause').click(function(event) {
				event.preventDefault();
				options.autoPlay = false;
				self.pause();
			});

			$('.am-play').click(function(event) {
				event.preventDefault();
				options.autoPlay = true;
				self.play();
			});

			if(self.options.keyboard) {
				$(document).on('keyup', function(event) {
					var code = event.which;

					switch(code) {
						case 39: // Right arrow
							self.slide('next');
							break;
						case 37: // Left arrow
							self.slide('prev');
							break;
						case 80: // p
							if(self.isPlaying) {
								self.pause();
							} else {
								self.play();
							}
							break;
						default:
							break;
					}
				});
			}
		};

		/**
		 * Initialise the slides CSS
		 * @return {n/a}
		 */
		this.initSlides = function() {
			var self = this;

			// Add current active classes to current elements
			self.slides.eq(self.current).addClass('am-current');
			$('.am-tab').eq(self.current).addClass('am-tab-current');

			if(self.options.cssTransitions && self.transitionSupport) {
				// Set up the slides for CSS transition usage
				self.slides.css({
					'float': 'left',
					'margin-right': '-100%',
					'opacity' : 0,
					'visibility' : 'hidden',
					'transition-duration' : self.options.animDuration/1000 + 's',
					'transition-property': 'all'
				});

				self.slides.eq(0).css({
					'opacity' : 1,
					'visibility' : 'visible'
				});
			} else {
				// Set up the slides for JS animation
				self.slides.css('display', 'none');
				self.slides.eq(0).css('display', 'list-item');
			}
		};

		// Quick access functions for external use
		this.next = function() {
			var self = this;
			self.slide('next');
		};

		this.prev = function() {
			var self = this;
			self.slide('prev');
		};

		// Animate to a particular slide. Pass in the slide number (slides start at zero)
		// Accepts 'next' and 'prev'
		this.slide = function(slideNum) {
			var self = this;

			switch(slideNum) {
				case !isNaN(slideNum) && parseInt(Number(slideNum)) :
					if(slideNum >= 0 && slideNum <= self.numSlides - 1) {
						self.animatingTo = slideNum;
						// console.log('jumping to slide:' + self.animatingTo);
					} else {
						self.animatingTo = undefined;
					}
					break;

				case 'prev' :
					var prev = self.current-1;
					self.animatingTo = (prev < 0) ? self.numSlides - 1 : prev;
					// console.log('prev');
					break;

				case 'next' :
				/* falls through */
				default :
					var next = self.current+1;
					self.animatingTo = (next > self.numSlides - 1) ? 0 : next;
					// console.log('next');
					break;
			}

			if(!self.isAnimating && self.current !== slideNum && typeof self.animatingTo !== 'undefined') {
				self.pause();
				self.animate();
				self.current = self.animatingTo;

				if(self.options.autoPlay) {
					if(self.options.pauseOnHover && !self.el.is(':hover')) {
						self.play();
					}
				}
			}
		};

		this.pause = function() {
			var self = this;
			clearInterval(self.setInterval);
			self.isPlaying = false;

			// console.log('paused');
		};

		this.play = function() {
			var self = this;

			if(!self.isPlaying) {
				self.setInterval = setInterval(function() { self.slide('next'); }, self.options.slideDuration);
				self.isPlaying = true;

				// console.log('playing');
			} else { console.log('already playing'); }
		};

		this.animate = function() {
			var self = this;

			// Make damn sure that we don't animate more than once at a time
			if(!self.isAnimating) {
				self.isAnimating = true;
				console.log('current:' + self.current + 'next:'+ self.animatingTo);

				self.slides.eq(self.current).removeClass('am-current');
				self.slides.eq(self.animatingTo).addClass('am-current');

				$('.am-tab').eq(self.current).removeClass('am-tab-current');
				$('.am-tab').eq(self.animatingTo).addClass('am-tab-current');

				if(self.options.cssTransitions && self.transitionSupport) {
					// CSS transition animation
					self.slides.eq(self.current).css({
						'opacity' : 0,
						'visibility' : 'hidden'
					});
					self.slides.eq(self.animatingTo).css({
						'opacity' : 1,
						'visibility' : 'visible'
					});

					// Check for CSS animation completion
					$(self.slides.eq(self.animatingTo)).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
						self.isAnimating = false;

					});

				} else {
					// jQuery transition animation

					self.slides.eq(self.current).fadeOut(self.options.animDuration);
					self.slides.eq(self.animatingTo).fadeIn(self.options.animDuration);

					self.isAnimating = true;

					setTimeout(function() { self.isAnimating = false; }, self.options.animDuration);
				}
			}
		};

		this.init(element, options);
	};

	// Lets get this show on the road
	$.fn.amSlider = function( options ) {
		return this.each(function() {
			(new $.amSlider($(this), options));
		});
	};


	// Private functions

	/**
	 * Appending the prev/next controls to the DOM
	 * @param  {string} element The element containing the slider
	 * @param  {object} options All the options for the slider
	 * @return {n/a}
	 */
	function appendDirectionControls(element, options) {
		if(options.directionControls === true && $('.am-direction-controls').length === 0) {

			var dirControlsScaffold = '<ul class="am-direction-controls"><li class="am-prev"><a href="#">' + options.directionContolsText.prev + '</a></li><li class="am-next"><a href="#">' + options.directionContolsText.next + '</a></li></ul>';

			$(element).append(dirControlsScaffold);
		}
	}

	/**
	 * Appending the navigation controls to the DOM
	 * @param  {string} element The element containing the slider
	 * @param  {object} options All the options for the slider
	 * @return {n/a}
	 */
	function appendNavControls(element, options) {
		if((options.navControlsClass === '.am-nav-controls' && $(options.navControlsClass).length === 0) || $(options.navControlsClass).length === 0) {
			var navControlsScaffold = '<ul class="am-nav-controls">';
			var numSlides = $(options.slideContainer).find(options.slideElement).length;

			for (var i = 1; i < numSlides + 1; i++) {
				navControlsScaffold += '<li class="am-tab"><a href="#">' + i + '</a></li>';
			}

			navControlsScaffold += '</ul>';

			$(element).append(navControlsScaffold);
		} else {
			$(options.navControlsClass).children().addClass('am-tab');
		}
	}

	/**
	 * Checking to see if CSS transitions are supported
	 * @param  {array} vendors Array of browser vendors
	 * @return {bool}         true/false based on browser support of CSS transitions
	 */
	function checkTransitionSupport(vendors) {
		// We may be lucky and already have Modernizr
		if(typeof(window.Modernizr) !== 'undefined') {
			if(Modernizr.csstransitions) { return true; }
		} else {
			// From http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr

			var docBody = document.body || document.documentElement,
				style = docBody.style,
				property = 'transition';

			// Test for W3C support
			if (typeof style[property] == 'string') { return true; }

			// Tests for vendor specific support
			property = property.charAt(0).toUpperCase() + property.substr(1);

			for (var i=0; i < vendors.length; i++) {
				if (typeof style[vendors[i] + property] == 'string') { return true; }
			}
			return false;
		}
	}

	// Slider default options
	$.amSlider.defaultOptions = {
		animDuration: 1000, // Duration of animation between slides
		autoPlay: true,	// Autoplay the slider on page load
		cssTransitions: true, // Use CSS for the transitions
		directionControls: true, // prev/next controls
		directionContolsText: { // The text showin the prev/next buttons on the slider
			prev: 'prev',
			next: 'next'
		},
		keyboard: false,
		navControls: true, // Navigation controls to flick through slides
		navControlsClass: '.am-nav-controls', // Class of navigation controls container
		pauseOnHover: false, // Pause the slider animations on hover
		slideContainer: '.slides', // The ul or div (inside the main container) that houses our slides
		slideElement: 'li', // Can be a class name, or div, or li, or id
		slideDuration: 5000, // Length each slide is active for
	};
}( jQuery ));

$('.slider-1').amSlider({
	animDuration: 2000,
	keyboard: true,
	navControlsClass: '.slider-nav-controls',
	pauseOnHover: true,
	slideDuration: 5000,
	slideElement: '.slide'
});
/*var something = $('.slider-1').amSlider({
	autoPlay : true,
	cssTransitions: false,
	pauseOnHover : true,
// 	directionControls : true,
	// navControlsClass : '.toast'
});


$('.clicknext').click(function() {
	something.data('amSlider').slide(8);
});*/