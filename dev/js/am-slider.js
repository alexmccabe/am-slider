;(function ( $ ) {
	'use strict';

	$.slider = function( element, options ) {
		this.options = {};
		this.el = $(element);

		// Public functions
		this.init = function(element, options) {
			var self = this;
			self.options = $.extend({}, $.slider.defaultOptions, options);
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
			self.domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');


			if(checkTransitionSupport()) self.transitionSupport = true;

			console.log(self.transition);


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
				}
			});

		};

		this.next = function() {
			var self = this;

			if(!self.isAnimating) {
				var next = self.current+1;

				self.animatingTo = (next > self.numSlides - 1) ? 0 : next;
				self.animate();

				self.current = self.animatingTo;
			}
		};

		this.prev = function() {
			var self = this;

			if(!self.isAnimating) {
				var prev = self.current-1;

				self.animatingTo = (prev < 0) ? self.numSlides - 1 : prev;

				self.animate();
				self.current = self.animatingTo;
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
				}
			}
		};

		this.pause = function() {
			var self = this;
			clearInterval(self.setInterval);
			self.options.autoPlay = false;
		};

		this.play = function() {
			var self = this;

			self.setInterval = setInterval(self.next.bind(self), self.options.slideDuration);
			self.options.autoPlay = true;
		};

		this.animate = function() {
			var self = this;

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

				// Old school way of preventing more than one animation at once
				// setTimeout(function() { self.isAnimating = false; }, self.options.animDuration);
			}
		};

		this.init(element, options);
	};

	// Lets get this show on the road
	$.fn.slider = function( options ) {
		return this.each(function() {
			(new $.slider($(this), options));
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

	function checkTransitionSupport(element, options) {
		if(typeof(window.Modernizr) !== 'undefined') {
			if(Modernizr.csstransitions) { return true; }
		} else {

		}

		return false;
	}

	// Slider default options
	$.slider.defaultOptions = {
		animDuration: 1000, // Duration of animation between slides
		autoPlay: true,	// Autoplay the slider on page load
		cssTransitions: false, // Use CSS for the transitions
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


$('.am-slider').slider({
	autoPlay : true,
	pauseOnHover : true,
	directionControls : true,
	// navControlsClass : '.toast'
});