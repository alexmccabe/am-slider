A simple JS slider (he says, when all it does is fade at the moment...).

###Issues
_There are a couple issues that I am working to fix_

+ A bug where `autoPlay` is set to `false` and then the slide is set to cycle manually (by clicking a link for example), then choosing to cycle a slide. This will stop the cycling of slides.
+ A bug where jQuery animations do not work
+ A bug where playing the slider from an external call decreases time between slides if done more than once

###Features

+ Modernizr support. If `window.Modernizr` exists it will check for support of CSS transitions
+ Custom slider paging tabs. If you provide a class for the navControlsClass, these will not be automatically generated
+ Pause the slider on hover
+ Externally accessible methods for controlling the slider

###Future features

+ Video support
+ Other transitions (slide)