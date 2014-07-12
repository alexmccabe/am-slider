;(function ( $ ) {
	'use strict';

	$.amSlider = function( element, options ) {
		this.options = {};
		this.el = $(element);

		this.el.data('amSlider', this);


		// Public functions
		this.init = function(element, options) {
			var self = this;
			console.log(self);
			self.options = $.extend({}, $.amSlider.defaultOptions, options);
			options = self.options;

			// Base variables needed to run the slider
			self.slideContainer = self.el.children(options.slideContainer);
			self.slides = $(self.slideContainer).find(options.slideElement);
			self.numSlides = self.slides.length; // Total number of slides
			self.isAnimating = false; // Checking if the slider is currently animating
			self.current = 0; // Current slide showing
			self.setInterval = null; // Interval between slides

			// Detecting CSS transition support
			self.transitionSupport = false;
			self.domPrefixes = 'webkit Webkit Moz O ms Khtml'.split(' ');

			if(checkTransitionSupport(self.domPrefixes)) self.transitionSupport = true;
			// console.log(self.transitionSupport);

			// Append the extra items needed
			if(options.directionControls) appendDirectionControls(element, options);
			if(options.navControls) appendNavControls(element, options);

			// Add current active classes to current elements
			self.slides.eq(self.current).addClass('am-current');
			$('.am-tab').eq(self.current).addClass('am-tab-current');

			this.initEvents();
		};

		this.initEvents = function() {
			var self = this;
			self.slides.css('transition-duration', self.options.animDuration/1000 + 's');

			if(self.options.autoPlay) self.play();
			if(self.options.pauseOnHover && self.options.autoPlay) {
				self.el.hover(function() {
					self.pause();
				}, function() {
					self.play();
				});
			}

			$('.am-prev').click(function(event) {
				event.preventDefault();

				self.pause();
				self.prev();
			});

			$('.am-next').click(function(event) {
				event.preventDefault();

				self.pause();
				self.next();
			});

			$('.am-tab').click(function(event) {
				event.preventDefault();
				var tabIndex = $(this).index();

				self.pause();
				self.slide(tabIndex);
			});

			$('.am-pause').click(function(event) {
				event.preventDefault();
				self.pause();
			});

			$('.am-play').click(function(event) {
				event.preventDefault();
				if(!self.options.autoPlay) {
					self.play();
				} else { console.log('already playing'); }
			});

		};

		this.next = function() {
			var self = this;
			// console.log('hi');

			if(!self.isAnimating) {
				var next = self.current+1;

				self.animatingTo = (next > self.numSlides - 1) ? 0 : next;
				self.animate();

				self.current = self.animatingTo;

				console.log('next');
			}
		};

		this.prev = function() {
			var self = this;

			if(!self.isAnimating) {
				var prev = self.current-1;

				self.animatingTo = (prev < 0) ? self.numSlides - 1 : prev;

				self.animate();
				self.current = self.animatingTo;
				console.log('prev');
			}
		};

		// Animate to a particular slide. Pass in the slide number (slides start at zero)
		this.slide = function(slideNum) {
			var self = this;

			if(slideNum >= 0 && slideNum <= self.numSlides - 1) {
				if(!self.isAnimating && self.current !== slideNum) {
					self.animatingTo = slideNum;
					self.animate();
					self.current = self.animatingTo;

					console.log('jumping to slide:' + self.animatingTo);
				}
			}
		};

		this.pause = function() {
			var self = this;
			clearInterval(self.setInterval);
			self.options.autoPlay = false;

			console.log('paused');
		};

		this.play = function() {
			var self = this;

			self.setInterval = setInterval(self.next.bind(self), self.options.slideDuration);
			self.options.autoPlay = true;

			console.log('playing');
		};

		this.animate = function() {
			var self = this;

			if(self.options.cssTransitions && self.transitionSupport) {
				// If CSS transitions are wanted AND the browser supports them
				if(!self.isAnimating) {
					console.log('current:' + self.current + 'next:'+ self.animatingTo);
					self.slides.eq(self.current).removeClass('am-current');
					self.slides.eq(self.animatingTo).addClass('am-current');

					$('.am-tab').eq(self.current).removeClass('am-tab-current');
					$('.am-tab').eq(self.animatingTo).addClass('am-tab-current');

					self.isAnimating = true;

					// Check for CSS animation completion
					$(self.slides.eq(self.current), self.slides.eq(self.animatingTo)).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e){
						self.isAnimating = false;
					});
				}
			} else {
				// We do the old school JS animations instead

				// Old school way of preventing more than one animation at once

				// self.slides.eq(self.current).fadeOut(self.options.animDuration);
				self.slides.eq(self.animatingTo).fadeIn(self.options.animDuration);

				self.isAnimating = true;

				setTimeout(function() { self.isAnimating = false; }, self.options.animDuration);
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

	// Adding the prev/next buttons to the slider
	function appendDirectionControls(element, options) {
		if(options.directionControls === true && $('.am-direction-controls').length === 0) {

			var dirControlsScaffold = '<ul class="am-direction-controls"><li class="am-prev"><a href="#">' + options.directionContolsText.prev + '</a></li><li class="am-next"><a href="#">' + options.directionContolsText.next + '</a></li></ul>';

			$(element).append(dirControlsScaffold);
		}
	}

	// Adding the control tabs to the slider
	function appendNavControls(element, options) {
		if(options.navControlsClass === '.am-nav-controls' && $('.am-nav-controls').length === 0) {
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
		navControls: true, // Navigation controls to flick through slides
		navControlsClass: '.am-nav-controls', // Class of navigation controls container
		pauseOnHover: false, // Pause the slider animations on hover
		slideContainer: '.slides', // The ul or div (inside the main container) that houses our slides
		slideElement: 'li', // Can be a class name, or div, or li, or id
		slideDuration: 5000, // Length each slide is active for
	};
}( jQuery ));


var something = $('.am-slider').amSlider({
// 	autoPlay : false,
	cssTransitions: true,
// 	pauseOnHover : false,
// 	directionControls : true,
// 	navControlsClass : '.toast'
});


$('.clicknext').click(function() {
	something.data('amSlider').next();
});