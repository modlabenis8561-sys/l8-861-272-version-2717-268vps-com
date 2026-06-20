(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initCarousel() {
    var root = document.querySelector('[data-carousel]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hero-dot'));
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initHeroSearch() {
    var form = document.querySelector('[data-hero-search]');
    if (!form) {
      return;
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="search"]');
      var value = input ? input.value.trim() : '';
      var target = './search.html';
      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }
      window.location.href = target;
    });
  }

  function initFilters() {
    var panel = document.querySelector('[data-filter-panel]');
    if (!panel) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var noResults = document.querySelector('[data-no-results]');
    var inputs = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
    var params = new URLSearchParams(window.location.search);
    var queryInput = panel.querySelector('[data-filter="query"]');
    if (queryInput && params.get('q')) {
      queryInput.value = params.get('q');
    }

    function valueOf(name) {
      var el = panel.querySelector('[data-filter="' + name + '"]');
      return el ? normalize(el.value) : '';
    }

    function apply() {
      var query = valueOf('query');
      var category = valueOf('category');
      var year = valueOf('year');
      var region = valueOf('region');
      var type = valueOf('type');
      var visible = 0;
      cards.forEach(function (card) {
        var search = normalize(card.getAttribute('data-search'));
        var ok = true;
        if (query && search.indexOf(query) === -1) {
          ok = false;
        }
        if (category && normalize(card.getAttribute('data-category')) !== category) {
          ok = false;
        }
        if (year && normalize(card.getAttribute('data-year')) !== year) {
          ok = false;
        }
        if (region && normalize(card.getAttribute('data-region')) !== region) {
          ok = false;
        }
        if (type && normalize(card.getAttribute('data-type')) !== type) {
          ok = false;
        }
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (noResults) {
        noResults.classList.toggle('is-visible', visible === 0);
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', apply);
      input.addEventListener('change', apply);
    });
    apply();
  }

  function initPlayer() {
    var player = document.querySelector('[data-player]');
    if (!player) {
      return;
    }
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-player-cover]');
    var button = player.querySelector('[data-player-button]');
    var source = video ? video.getAttribute('data-stream') : '';
    var started = false;

    function load() {
      if (!video || !source) {
        return;
      }
      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }
      video.controls = true;
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', load);
    }
    if (cover) {
      cover.addEventListener('click', load);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          load();
        }
      });
    }
  }

  ready(function () {
    initMenu();
    initCarousel();
    initHeroSearch();
    initFilters();
    initPlayer();
  });
}());
