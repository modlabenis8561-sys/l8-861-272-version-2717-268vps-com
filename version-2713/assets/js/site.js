(function () {
    var header = document.querySelector("[data-header]");
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function updateHeader() {
        if (!header) {
            return;
        }
        header.classList.toggle("is-scrolled", window.scrollY > 40);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var minis = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-mini]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
            minis.forEach(function (mini, miniIndex) {
                mini.classList.toggle("is-active", miniIndex === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                play();
            });
        });

        minis.forEach(function (mini, miniIndex) {
            mini.addEventListener("mouseenter", function () {
                show(miniIndex);
                play();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                play();
            });
        }

        show(0);
        play();
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var scope = panel.parentElement || document;
            var input = panel.querySelector("[data-filter-search]");
            var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-select]"));
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
            var empty = scope.querySelector("[data-empty-state]");
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";

            if (input && query) {
                input.value = query;
            }

            function read(card, name) {
                return (card.getAttribute("data-" + name) || "").toLowerCase();
            }

            function apply() {
                var term = input ? input.value.trim().toLowerCase() : "";
                var active = {};
                selects.forEach(function (select) {
                    active[select.getAttribute("data-filter-select")] = select.value.trim().toLowerCase();
                });
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = ["title", "tags", "year", "region", "type", "category"].map(function (name) {
                        return read(card, name);
                    }).join(" ");
                    var ok = !term || haystack.indexOf(term) !== -1;
                    Object.keys(active).forEach(function (name) {
                        if (active[name] && read(card, name) !== active[name]) {
                            ok = false;
                        }
                    });
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            selects.forEach(function (select) {
                select.addEventListener("change", apply);
            });
            apply();
        });
    }

    initHero();
    initFilters();
})();
