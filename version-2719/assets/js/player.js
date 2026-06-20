(function () {
    var video = document.getElementById('movieVideo');
    var button = document.getElementById('playButton');
    var config = window.__MOVIE_PLAYER__ || {};
    var source = config.source || '';

    if (!video || !source) {
        return;
    }

    var hlsInstance = null;

    var attachSource = function () {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (video.src !== source) {
                video.src = source;
            }
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!hlsInstance) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            }
            return;
        }

        if (video.src !== source) {
            video.src = source;
        }
    };

    var startPlayback = function () {
        attachSource();

        if (button) {
            button.classList.add('is-hidden');
        }

        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    };

    if (button) {
        button.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
        if (!video.src) {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });
})();
