(function ( $ ) {
	'use strict';

	$.slider = function( element, options ) {
		this.options = {};
		this.el = $(element);

		// Public functions
		this.init = function(element, options) {
			var self = this;
			self.options = $.extend({}, $.slider.defaultOptions, options);
			options = self.options;

			self.slideContainer = self.el.children(options.slideContainer);
			self.slides = $(self.slideContainer).find(options.slideElement);
			self.numSlides = self.slides.length;

			self.isAnimating = false;
			self.current = 0;
			/*self.currentSlide = self.slides.eq(self.current);*/
			/*self.animatingTo = self.currentSlide;*/

			self.slides.eq(self.current).addClass('am-current');
			self.setInterval = null;

			// console.log($(self).index());

			appendNavControls(element, self.options);
			appendDirectionControls(element, self.options);

			this.initEvents();
		};

		this.initEvents = function() {
			var self = this;
			self.slides.css('transition-duration', self.options.animDuration/1000 + 's');

			self.play();

			if(self.options.pauseOnHover === true) {
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

		};

		this.next = function() {
			var self = this;
			var next = self.current+1;

			self.animatingTo = (next > self.numSlides - 1) ? 0 : next;
			self.animate();

			self.current = self.animatingTo;
		};

		this.prev = function() {
			var self = this;
			var prev = self.current-1;

			self.animatingTo = (prev < 0) ? self.numSlides - 1 : prev;

			self.animate();
			self.current = self.animatingTo;
		};

		this.pause = function() {
			var self = this;
			clearInterval(self.setInterval);
		};

		this.play = function() {
			var self = this;
			self.setInterval = setInterval(self.next.bind(self), self.options.slideDuration);
		};

		this.animate = function() {
			var self = this;
			if(self.isAnimating === false) {
				console.log('current:' + self.current + 'next:'+ self.animatingTo);
				self.slides.eq(self.current).removeClass('am-current');
				self.slides.eq(self.animatingTo).addClass('am-current');

				self.isAnimating = true;
			}

			$(self.options.slideContainer + ' ' + self.options.slideElement).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				self.isAnimating = false;
			});
		};

		this.init(element, options);
	};

	$.fn.slider = function( options ) {
		return this.each(function() {
			(new $.slider($(this), options));
		});
	};


	// Private functions


	function appendNavControls(element, options) {

	}

	function appendDirectionControls(element, options) {
		if(options.directionControls === true && $('.am-direction-controls').length === 0) {

			var dirControlsScaffold = '<ul class="am-direction-controls"><li class="am-prev"><a href="#">' + options.directionContolsText.prev + '</a></li><li class="am-next"><a href="#">' + options.directionContolsText.next + '</a></li></ul>';

			$(element).append(dirControlsScaffold);
		}
	}

	// Slider default options
	$.slider.defaultOptions = {
		slideContainer: '.slides', // The ul or div (inside the main container) that houses our slides
		slideElement: 'li', // Can be a class name, or div, or li, or id
		slideDuration: 5000, // Length each slide is active for
		animDuration: 1000, // Duration of animation between slides
		directionControls: true, // prev/next controls
		directionContolsText: {
			prev: 'prev',
			next: 'next'
		},
		navControls: true, // Navigation controls to flick through slides
		navControlsClass: '', // Class of navigation controls container
		pauseOnHover: false // Pause the slider animations on hover
	};
}( jQuery ));


$('.am-slider').slider({
	pauseOnHover : true
});


/*return this.each( function() {
	this.numSlides = $(this).find(settings.slideElement).length;


	this.appendNav = function() {
		var self = this;

		// We only want to append a nav if there isn't one defined
		if(settings.sliderNav === '' && $('.slider-nav').length === 0) {
			$(self).append('<ul class="slider-nav"></ul>');
			settings.sliderNav = '.slider-nav';

			for (var i = 1; i < self.numSlides + 1; i++) {
				$(settings.sliderNav).append('<li>' + i + '</li>');
				console.log('<li>' + i + '</li>');
			}
		}
	};

	this.appendNav();
});*/