
(function () {
  const video = document.querySelector('[data-player-video]');
  if (!video) return;

  const playBtn = document.querySelector('[data-play-button]');
  const status = document.querySelector('[data-player-status]');
  const sourceBtns = Array.from(document.querySelectorAll('[data-source-btn]'));
  const demoHls = video.getAttribute('data-hls') || '';
  const demoMp4 = video.getAttribute('data-mp4') || '';
  let hls = null;
  let current = 'hls';

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  function destroyHls() {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  }

  function loadSource(kind) {
    current = kind;
    sourceBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-source-btn') === kind);
    });

    destroyHls();
    video.pause();
    video.removeAttribute('src');
    video.load();

    if (kind === 'hls') {
      if (window.Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(demoHls);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          setStatus('已载入 HLS 播放源');
        });
        hls.on(Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            setStatus('HLS 播放失败，已切换备用源');
            loadSource('mp4');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = demoHls;
        setStatus('当前浏览器支持原生 HLS');
      } else {
        setStatus('当前环境不支持 HLS，已切换备用源');
        loadSource('mp4');
      }
    } else {
      video.src = demoMp4;
      setStatus('已载入 MP4 备用播放源');
    }
  }

  function startPlay() {
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        setStatus('请再次点击播放按钮');
      });
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', function () {
      startPlay();
    });
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlay();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', function () { setStatus('正在播放'); });
  video.addEventListener('pause', function () { setStatus('已暂停'); });
  video.addEventListener('ended', function () { setStatus('播放已结束，可重新点击播放'); });

  sourceBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      loadSource(btn.getAttribute('data-source-btn'));
      startPlay();
    });
  });

  loadSource(current);
})();
