A simple JS slider (he says, when all it does is fade at the moment...).

###Issues
_There are a couple issues that I am working to fix_

+ A bug where `autoPlay` is set to `false` and then the slide is set to cycle manually (by clicking a link for example), then choosing to cycle a slide. This will stop the cycling of slides.
+ A bug where jQuery animations do not work
+ A bug where playing the slider from an external call decreases time between slides if done more than once

###Features

+ Modernizr support. If `window.Modernizr` exists it will check for support of CSS transitions
+ Custom slider paging tabs. If you provide a class for the `navControlsClass`, tabs will not be automatically generated
+ Pause the slider on hover
+ Externally accessible methods for controlling the slider
+ Custom text on next & previous controls

###Future features

+ Video support
+ Other transitions (slide)

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