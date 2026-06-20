(function () {
    var video = document.getElementById("movie-player");
    var overlay = document.querySelector("[data-play-overlay]");
    var shell = document.querySelector("[data-player-shell]");
    var hls = null;
    var attached = false;

    if (!video) {
        return;
    }

    function getUrl() {
        var source = video.querySelector("source");
        return source ? source.getAttribute("src") : video.getAttribute("src");
    }

    function bind() {
        var url = getUrl();
        if (!url || attached) {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            attached = true;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            attached = true;
            return;
        }
        video.src = url;
        attached = true;
    }

    function hideOverlay() {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    }

    function start() {
        bind();
        hideOverlay();
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", start);
    }

    if (shell) {
        shell.addEventListener("click", function (event) {
            if (event.target === video && video.paused) {
                start();
            }
        });
    }

    video.addEventListener("play", hideOverlay);
    video.addEventListener("loadedmetadata", hideOverlay);
    window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
            hls.destroy();
        }
    });
})();
