# Lighting effects with simple fades

Using layered images, it is possible to create dynamic lighting effects
by progressively adjusting the opacity of each layer. The resulting effect
will look like as smooth as video, but without needing to transcode large files
or fight auto-play restrictions on mobile devices.

## Image setup

First you'll need to create 3 images of the same object with different
lighting configurations. The first image should show the initial state of the
effect, the second image will be the middle transition, and the final image
will be the final.

## Stacking the images

1. Set up a `<div>` container element that has `position: relative` style.
2. Add each `<img>` inside the container with `position: absolute`

The `absolute` positioning will allow the images to stack on top of eachother
while the `relative` style in the container prevent the images from escaping to
the top of the page.

The HTML and CSS code should look something like:

    <!doctype html>
    <html>
      <head>
      <style>
        #container { position: relative; }
        #container img { position: absolute; }
      </style>
      <body>
        <div id="container">
          <img src="path/to/image1.jpg"/>
          <img src="path/to/image2.jpg"/>
          <img src="path/to/image3.jpg"/>
        </div>
        <script>
          // we will be putting more code here
        </script>
      </body>
    </html>

## Tracking the images in code

We need a very basic structure in the code to track and fade the images.
This structure can also keep track of the animation's progress. It looks like:

    function Shader(images) {
      this.images = images;
    }

    Shader.prototype.update = function (progress) {
      this.images[1].style.opacity = clamp(progress - 0.33, 0, 0.33) / 0.33;
      this.images[2].style.opacity = clamp(progress - 0.66, 0, 0.33) / 0.33;
    };

The constructor here just accepts a `NodeList` of images we will be tracking.
Using the handy [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document.querySelectorAll)
function to get the images from the DOM, we can construct our object like so:

    var shader = new Shader(document.querySelectorAll('#container img'));

## Opacity changes

The lighting effect is achieved by showing the image on the bottom of the
stack first, unmodified. In fact the bottom image is never faded at all -
it is just what the user sees first.

As the animation progresses, we gradually fade in the images from
bottom-to-top, so the user will see the middle image fade in first,
followed by the top image a few moments later.

We can do this by tracking the `progress` of the animation from 0 to 1
(0% to 100%, if you like). Based on that `progress` variable we can fade the
top images appropiately so that the middle image finishes its fade-in before
the final image:

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    this.images[1].style.opacity = clamp(progress - 0.33, 0, 0.33) / 0.33;
    this.images[2].style.opacity = clamp(progress - 0.66, 0, 0.33) / 0.33;

The first opacity line instucts the middle image to fade in between 33% and
66% of the animation. The final image starts fading at 66% and finishes at
99% (basically the end).

The `clamp` function here simply keeps `progress` within the bounds of `0`
and `0.33` (the max it will be divided by). This is necessary because before
the animation is at 66% progress, the final image would calculate
`progress - 0.66` as a negative number (e.g. `-0.66`) - it's
better to just keep it at `0` in that case since that image is not supposed to
be fading yet. This will delay the fading of that image until the animation
progress is beyond 66% (the only time `progress - 0.66` would be positive).

## Tweening

Now that our animation is able to react to a `progress` variable, it's time
to animate that variable.

One very easy way is to apply the current time to a sine wave. This will
provide a natural bounce from 0 to 1.

Code first, explain later:

	/* Create new animation */
    var shader = new Shader(document.querySelectorAll('#container img'));

	/* Define the animation loop */
    function animate() {
        /* Get sine for current time */
        var angle = Math.sin(Date.now() * 0.002);

        /* Normalize sine to 0..1 */
        var progress = (1 + angle) * 0.5;

        /* Ask animation to update the fades */
        shader.update(progress);

        /* Repeat! */
        requestAnimationFrame(animate);
    }

    /* Begin animation */
    animate();

`Date.now()` returns the current time in milliseconds. Multiplying it by
`0.002` will slow down the "bounce" of the sine wave.

Sine waves are actually in the `-1 to 1` range, so the `(1 + angle) * 0.5`
formula is used to normalize it to the `0 to 1` range, which is what our
animation expects.

Passing the resulting `progress` variable to our animation will update
the fades of the images.

Using [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)
in modern browsers will call a function the next time browser paints the
window (usually synced to your monitor's refresh rate). If your browser
doesn't support this, you can just use `setTimeout` instead:

    setTimeout(animate, 16); // 16ms = ~60fps

## Adding interactivity

TODO head tracking demo
