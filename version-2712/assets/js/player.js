(function () {
    window.YibenPlayer = function (videoId, overlayId, sourceUrl, title) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var hls = null;
        var attached = false;

        if (!video || !overlay || !sourceUrl) {
            return;
        }

        function hideOverlay() {
            overlay.classList.add("hidden");
        }

        function playVideo() {
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {});
            }
        }

        function attachSource() {
            if (attached) {
                playVideo();
                return;
            }
            attached = true;

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                        hls = null;
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
                playVideo();
            } else {
                video.src = sourceUrl;
                playVideo();
            }
        }

        overlay.addEventListener("click", function () {
            hideOverlay();
            attachSource();
        });

        video.addEventListener("play", hideOverlay);
        video.setAttribute("aria-label", title || "影片播放");
    };
})();
