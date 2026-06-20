(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('is-open');
            document.body.classList.toggle('is-menu-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        var setSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        var restart = function () {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                setSlide(current + 1);
            }, 5000);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                setSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setSlide(current + 1);
                restart();
            });
        }

        restart();
    }

    var searchList = document.querySelector('[data-search-list]');

    if (searchList) {
        var cards = Array.prototype.slice.call(searchList.querySelectorAll('.movie-card'));
        var input = document.querySelector('[data-search-input]');
        var typeSelect = document.querySelector('[data-filter-type]');
        var regionSelect = document.querySelector('[data-filter-region]');
        var yearSelect = document.querySelector('[data-filter-year]');
        var count = document.querySelector('[data-result-count]');

        var normalize = function (value) {
            return String(value || '').trim().toLowerCase();
        };

        var update = function () {
            var keyword = normalize(input && input.value);
            var type = normalize(typeSelect && typeSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var shown = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (type && normalize(card.getAttribute('data-type')) !== type) {
                    matched = false;
                }

                if (region && normalize(card.getAttribute('data-region')) !== region) {
                    matched = false;
                }

                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    matched = false;
                }

                card.classList.toggle('is-hidden', !matched);

                if (matched) {
                    shown += 1;
                }
            });

            if (count) {
                count.textContent = '共 ' + shown + ' 部内容';
            }
        };

        [input, typeSelect, regionSelect, yearSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', update);
                element.addEventListener('change', update);
            }
        });
    }
})();
