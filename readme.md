A simple jQuery slider (he says, when all it does is fade at the moment...).

###Features

+ Modernizr support. If `window.Modernizr` exists it will check for support of CSS transitions
+ CSS transitions checking if Mordernizr is not available
+ Custom slider paging tabs. If you provide a class for the `navControlsClass`, tabs will not be automatically generated
+ Pause the slider on hover
+ Externally accessible methods for controlling the slider
+ Custom text on next & previous controls
+ Keyboard control (left/right `arrow keys` & pause/play `p`)

###Future features

+ Video support
+ Other transitions (slide)
+ Loading different images for each slide based on browser width
+ Touch support
+ Multiple sliders on a single page

##Using the slider

####HTML
All that is required is a surrounding `div`, a container for the slides and the slides themselves. The most semantic way of doing this would be as list items, shown below, but you may use all `div` if you want to.

```html
<div class="am-slider">
	<ul class="slides">
		<li class="slide">
			<img src="http://placekitten.com/940/360" alt="">
		</li>
		<li class="slide">
			<img src="http://placekitten.com/940/360" alt="">
		</li>
		<li class="slide">
			<img src="http://placekitten.com/940/360" alt="">
		</li>
		<li class="slide">
			<img src="http://placekitten.com/940/360" alt="">
		</li>
		<li class="slide">
			<img src="http://placekitten.com/940/360" alt="">
		</li>
		<li class="slide">
			<img src="http://placekitten.com/940/360" alt="">
		</li>
	</ul>
</div>
```

_Classnames are not specific to the slider and may be anything you wish, however they will have to be definied in the options._

####JavaScript
To call the slider into action, you do the same as any other jQuery plugin. In this case it would be `$('.am-slider').amSlider();`.

####Options
The slider accepts many options, and the defaults are set as such

```javascript
animDuration: 1000, 					// [integer] Duration of animation between slides
autoPlay: true,							// [boolean] Autoplay the slider on page load
cssTransitions: true, 					// [boolean] Use CSS for the transitions
directionControls: true, 				// [boolean] Generate prev/next controls
directionContolsText: { 				// [object] The text showin the prev/next buttons on the slider
	prev: 'prev',
	next: 'next'
},
keyboard: false,						// [boolean] Control the slider via the keyboard
navControls: true, 						// [boolean] Navigation controls to flick through slides
navControlsClass: '.am-nav-controls', 	// [string] Class of navigation controls container
pauseOnHover: false, 					// [boolean] Pause the slider animations on hover
slideContainer: '.slides', 				// [string] The ul or div (inside the main container) that houses our slides
slideElement: 'li', 					// [string] Can be a class name, or div, or li, or id
slideDuration: 5000, 					// [integer] Length each slide is active for
```

Overriding the options is done on plugin call

```javascript
$('.am-slider').amSlider({
	animDuration : 2000,
	pauseOnHover : true,
	directionControlsText : {
		prev : '<',
		next : '>'
	}
});
```

####External Calls
If you want to operate the slider outside the bounds of the slider itself, you must first call the slider and assign it to a variable.

```javascript
var slider = $('.am-slider').amSlider({
	// Pass any options that you wish
});
```

Now you can access one of the methods from the slider. For example moving to the next slide.

```javascript
$('.clickNext').click(function() {
	slider.data('amSlider').next();
});
```

Available methods:

```
.next() 	// Go to next slide
.prev() 	// Go to previous slide
.slide(n) 	// Jump to a specific slide number
.pause() 	// Pause auto-cycling of the slides
.play() 	// Start auto-cycling of the slides
```