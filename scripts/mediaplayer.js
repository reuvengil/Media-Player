$(document).ready(function () {
    $('.video-container').each(function () {
        initMediaPlayer($(this));
    });
});

function initMediaPlayer(videoContainer) {
    // init functions:
    initControlButtons(videoContainer);
    displayControlsOnMouseMoveEvent(videoContainer);
    initProgressbar(videoContainer);

    // update data:
    videoContainer.css('width', videoContainer.attr('data-width'));
    videoContainer.css('height', videoContainer.attr('data-height'));
}

function initControlButtons(videoContainer) {
    const controls = videoContainer.find('.controls'),
        video = videoContainer.find('video').get(0);

    Object.keys(icons).forEach(key => {
        if (controls.find(`.${key}`).length) {
            controls.find(`.${key}`).html(icons[key]());
        }
    });
    controls.find('[data-on]').each(function () {
        $(this).html(icons[$(this).attr('data-on')]());
    });

    // set click events

    // play-pause
    controls.find('.play-pause').on('click', function () {
        if (video.paused) {
            video.play();
            $(this).html(icons['pause']);
        } else {
            video.pause();
            $(this).html(icons['play']);
        }
    });

    // 10 sec back-forward
    controls.find('.backTen').on('click', function () {
        video.currentTime -= 10;
    });
    controls.find('.forwardTen').on('click', function () {
        video.currentTime += 10;
    });

    // volume
    const progressVolume = videoContainer.find('.progress-volume');
    controls.find('.volumeOn-volumeOff').on('click', function () {
        video.muted = !video.muted;
        if (video.muted) {
            $(this).html(icons['volumeOff']);
        } else {
            $(this).html(icons['volumeOn']);
        }
    });

    // speed 

    // set the speed text
    controls.find('.speedText').html(`${speedLevels.before}${speedLevels.levels[0]}${speedLevels.after}`);

    controls.find('.speed').on('click', function () {
        const speedText = speedLevels.getNextLevel(controls.find('.speedText').html());
        controls.find('.speedText').html(speedText);
        video.playbackRate = parseFloat(speedText.replace(speedLevels.before, '').replace(speedLevels.after, ''));
    });

    // fullscreen
    controls.find('.fullscreen-exitFullscreen').on('click', function () {
        if (!document.fullscreenElement) {
            videoContainer.get(0).requestFullscreen();
            $(this).html(icons['exitFullscreen'])
        } else {
            document.exitFullscreen();
            $(this).html(icons['fullscreen'])
        }
    });
    // set time remaining
    const setTimeRemaining = () => {
        videoContainer.find('.video-duration').html(convertMilliSecondsToString(video.duration));
    };

    $(video).on('loadedmetadata', setTimeRemaining);
    if (video.readyState >= 2) {
        setTimeRemaining()
    }
}

function displayControlsOnMouseMoveEvent(videoContainer) {
    const controlsContainer = videoContainer.find('.controls-container');
    const videoTitle = videoContainer.find('.video-title');
    // set the title name
    videoTitle.html(videoContainer.find('source').attr('src'))

    let controlsTimeout;
    // show video slider
    videoContainer.on('mousemove', function () {
        controlsContainer.css('opacity', '1');
        videoTitle.css('opacity', '1');
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        controlsTimeout = setTimeout(() => {
            controlsContainer.removeAttr("style");
            videoTitle.removeAttr("style");
        }, 4000);
    });

    // show control video buttons
    let progressControlTimeout;
    var viewControls = () => {
        controlsContainer.css('bottom', '0');
        if (progressControlTimeout) {
            clearTimeout(progressControlTimeout);
        }
        progressControlTimeout = setTimeout(() => {
            controlsContainer.removeAttr("style");
            frameView.css('display', 'none');
        }, 4000);
    }

    videoContainer.find('.progress-controls').on('mousemove', viewControls);
    videoContainer.find('.controls').on('mousemove', viewControls);


    const progress = videoContainer.find('.progress');
    const frameView = videoContainer.find('.frame-view');
    const timeView = videoContainer.find('.time-view');
    const video = videoContainer.find('video').get(0);

    let mouseIsPressed, mouseIsInElement;
    progress.on('mousedown mouseup', e => mouseIsPressed = e.type === 'mousedown');
    progress.on('mouseleave mouseenter', e => mouseIsInElement = e.type === 'mouseenter');

    let lastTimeShowFrame;
    progress.on('mousemove mouseleave', async e => {
        frameView.css('display', (mouseIsInElement && !mouseIsPressed) ? 'block' : 'none');
        timeView.css('display', (mouseIsInElement && !mouseIsPressed) ? 'block' : 'none');
        if (mouseIsPressed) return;

        const percent = getPercent(videoContainer, e) / 100;

        timeView.html(convertMilliSecondsToString(video.duration * percent));

        const drawThumbnailImage = async () => {
            await getThumbnailForVideo(
                videoContainer.find('source').attr('src'),
                percent,
                frameView.get(0));
        }

        // Show video image every 400 milliseconds
        if (!lastTimeShowFrame) {
            lastTimeShowFrame = Date.now();
            await drawThumbnailImage();
        } else if (Date.now() - lastTimeShowFrame > 400) {
            lastTimeShowFrame = Date.now();
            await drawThumbnailImage()
        }
        // position the thumbnail
        var position = e.pageX - frameView.width() / 2;

        if (position + frameView.width() > videoContainer.offset().left + videoContainer.width() - 15) {
            position = videoContainer.offset().left + videoContainer.width() - frameView.width() - 15;
        } else if (position - 15 < videoContainer.offset().left) {
            position = 15;
        }
        timeView.css('left', `${position}px`);
        frameView.css('left', `${position}px`);
    });
}

function initProgressbar(videoContainer) {
    const progressTime = videoContainer.find('.progress-time'),
        timeView = videoContainer.find('.time-view'),
        videoCurrentTime = videoContainer.find('.video-currentTime'),
        controls = videoContainer.find('.controls'),
        video = videoContainer.find('video').get(0);
    videoCurrentTime.html(convertMilliSecondsToString('0'));

    progressTime.on('input change', function (e) {
        progressTime.css('background',
            `linear-gradient(90deg,var(--red) ${this.value}%, var(--white) ${this.value}%)`);
        if (timeView.css('display') === 'block') {
            video.currentTime = convertStringToSeconds(timeView.html());
            videoCurrentTime.html(timeView.html());
        } else {
            video.currentTime = (this.value / 100) * video.duration;
            videoCurrentTime.html(convertMilliSecondsToString(video.currentTime));
        }
    });

    $(video).on('timeupdate', function () {
        const percent = (video.currentTime / video.duration) * 100;
        progressTime.css('background',
            `linear-gradient(90deg,var(--red) ${percent}%, var(--white) ${percent}%)`);

        progressTime.val(percent);
        videoCurrentTime.html(convertMilliSecondsToString(video.currentTime));
    });
    $(video).on('ended', function () {
        controls.find('.play-pause').html(icons['play']);
        progressTime.val(0).change();
    });
}

async function getThumbnailForVideo(videoUrl, percent, canvasToExports) {
    const video = document.createElement("video");
    video.style.display = "none";

    // Trigger video load
    await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", () => {
            video.width = video.videoWidth;
            video.height = video.videoHeight;
            video.currentTime = video.duration * percent;
        });
        video.addEventListener("seeked", () => resolve());
        video.src = videoUrl;
    });

    // Draw the thumbnail
    canvasToExports
        .getContext("2d")
        .drawImage(
            video, 0, 0, video.videoWidth, video.videoHeight,
            0, 0, 300, 150);
    video.remove();
}

function getPercent(videoContainer, e) {
    const progressTime = videoContainer.find('.progress-time');
    var percent = ((e.pageX - progressTime.offset().left) / progressTime.width()) * 100;
    return percent;
}

//convert functions
function convertMilliSecondsToString(seconds) {
    const s = parseInt(seconds);
    return s < 3600 ?
        new Date(s * 1000).toISOString().substr(14, 5) :
        new Date(s * 1000).toISOString().substr(11, 8);
}

function convertStringToSeconds(timeString) {
    const hms = timeString.split(':');
    return hms.length === 3 ?
        (+hms[0]) * 3600 + (+hms[1]) * 60 + (+hms[2]) :
        (+hms[0]) * 60 + (+hms[1]);
}