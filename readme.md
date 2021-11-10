
# Custom Media Player

## A media player with high style customize options.

<img src="readme files/MediaPlayer.png" />

# Usage:

```HTML
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<link  rel="stylesheet" href="https://fonts.cdnfonts.com/css/netflix-sans" type="text/css"/>
<link  rel="stylesheet" href="styles/mediaplayer.css"/>

<script  src="scripts/custom.js"></script>
<script  src="scripts/mediaplayer.js"></script>
```

```HTML
<div class="video-container" data-width="600px" data-height="350px">
	<canvas class="frame-view"></canvas>
	<div class="time-view"></div>
	<div class="video-title"></div>
	<video>
		<source src="<your file source>" type="<your file type>"/>
	</video>
	<div class="controls-container">
		<div class="progress-controls">
			<div class="video-currentTime"></div>
			<div class="progress">
				<input class="progress-time" type="range" value="0" min="0" max="100" step="0.01"/>
			</div>
			<div class="video-duration"></div>
		</div>
		<div class="controls">
			<button class="play-pause" data-on="play"></button>
			<button class="backTen"></button>
			<button class="forwardTen"></button>
			<button class="volumeOn-volumeOff" data-on="volumeOn"></button>
			<div class="speed-container">
				<button class="speed"></button>
				<div class="speedText"></div>
			</div>
			<button class="fullscreen-exitFullscreen" data-on="fullscreen"></button>
		</div>
	</div>
</div>
```

## Optional:
data-width='X'.
<br>
data-height='X'.
<br>
(X in pixels)
<br>
to define screen size.

# Custom style options:
In the file [`custom.js`](scripts/custom.js), you can set the icons button by set the svg content.
```javascript
const  icons = {
play: () =>  $('<svg> ... </svg>'),
pause: () =>  $('<svg ... </svg>'),
backTen: () =>  $('<svg ... </svg>'),
forwardTen: () =>  $('<svg ... </svg>'),
volumeOn: () =>   $('<svg ... </svg>'),
volumeOff: () =>  $('<svg ... </svg>'),
speed: () =>  $('<svg ... </svg>'),
fullscreen: () =>  $('<svg ... </svg>'),
exitFullscreen: () =>  $('<svg ... </svg>'),
}
```
In addition you can set the speed text style by set the following options:
```javascript
const  speedLevels = {
before:  'x', 
levels: ['1.0', '1.25', '1.5', '2.0', '0.5', '0.75'],
after:  '',
...
}
```
**before**: a string which will be threaded before the speed number.
<br>
**levels**: array of speed levels, need to contain only float number as a string.
<br>
**after**: a string which will be threaded after the speed number.
# [`Demo`](demo.html)
To watch demo, run the file [`demo.html`](demo.html) in any desire browser.
