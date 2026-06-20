import { H as Hls } from "./hls.js";

export function initMoviePlayer(streamUrl) {
    const video = document.getElementById("movie-player");
    const button = document.getElementById("play-button");
    const shell = document.querySelector(".player-shell");
    let loaded = false;
    let hlsInstance = null;

    if (!video || !button || !shell) {
        return;
    }

    const loadStream = function () {
        if (loaded) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            loaded = true;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            loaded = true;
            return;
        }

        video.src = streamUrl;
        loaded = true;
    };

    const startPlayback = async function () {
        loadStream();
        shell.classList.add("is-started");

        try {
            await video.play();
        } catch (error) {
            shell.classList.remove("is-started");
        }
    };

    button.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });
    video.addEventListener("play", function () {
        shell.classList.add("is-started");
    });
    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
