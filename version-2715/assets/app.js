
(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  // Mobile nav
  const toggle = qs('.nav-toggle');
  const nav = qs('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Hero slider
  const slider = qs('[data-hero-slider]');
  if (slider) {
    const slides = qsa('.hero-slide', slider);
    const dotsWrap = qs('.hero-dots');
    let index = Math.max(0, slides.findIndex(function (slide) { return slide.classList.contains('active'); }));
    if (index < 0) index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      if (dotsWrap) {
        qsa('.hero-dot', dotsWrap).forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }
    }

    if (dotsWrap) {
      qsa('.hero-dot', dotsWrap).forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
    }

    setInterval(function () {
      show(index + 1);
    }, 4600);
  }

  // Search page
  const searchForm = qs('[data-search-form]');
  const searchResults = qs('[data-search-results]');
  const searchCount = qs('[data-search-count]');
  const emptyState = qs('[data-search-empty]');
  const data = window.MOVIE_DATA || [];

  function norm(text) {
    return String(text || '').toLowerCase().trim();
  }

  function chipList(list) {
    return (list || []).slice(0, 4).map(function (item) {
      return '<span class="pill">' + item + '</span>';
    }).join('');
  }

  function cardHTML(movie) {
    var meta = [movie.region, movie.type, movie.year].filter(Boolean).join(' · ');
    return '' +
      '<a class="movie-card" href="' + movie.path + '" style="--card-grad:' + movie.grad + '">' +
      '<span class="movie-badge">' + movie.category + '</span>' +
      '<h3 class="movie-title">' + movie.title + '</h3>' +
      '<div class="movie-meta">' + meta + '</div>' +
      '<p class="movie-desc">' + movie.one_line + '</p>' +
      '<div class="movie-foot"><span>' + movie.genres.join(' / ') + '</span><span>' + movie.score.toFixed(2) + '</span></div>' +
      '</a>';
  }

  function renderResults() {
    if (!searchForm || !searchResults) return;
    const keyword = norm(qs('[name="keyword"]', searchForm)?.value);
    const region = norm(qs('[name="region"]', searchForm)?.value);
    const type = norm(qs('[name="type"]', searchForm)?.value);
    const genre = norm(qs('[name="genre"]', searchForm)?.value);

    const filtered = data.filter(function (movie) {
      const hay = norm([movie.title, movie.region, movie.type, movie.year, movie.genres.join(' '), movie.tags.join(' '), movie.one_line].join(' '));
      const matchKeyword = !keyword || hay.indexOf(keyword) !== -1;
      const matchRegion = !region || norm(movie.region).indexOf(region) !== -1 || norm(movie.category).indexOf(region) !== -1;
      const matchType = !type || norm(movie.type).indexOf(type) !== -1;
      const matchGenre = !genre || movie.genres.some(function (g) { return norm(g).indexOf(genre) !== -1; }) || movie.tags.some(function (t) { return norm(t).indexOf(genre) !== -1; });
      return matchKeyword && matchRegion && matchType && matchGenre;
    });

    if (searchCount) searchCount.textContent = filtered.length + ' 条结果';
    searchResults.innerHTML = filtered.slice(0, 240).map(cardHTML).join('');
    if (emptyState) emptyState.style.display = filtered.length ? 'none' : 'block';
  }

  if (searchForm && searchResults) {
    searchForm.addEventListener('input', renderResults);
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      renderResults();
    });
    renderResults();
  }
})();
