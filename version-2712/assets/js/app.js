(function () {
    var header = document.querySelector("[data-header]");
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;
        var timer;

        function showSlide(next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function startHero() {
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startHero();
            });
        });

        showSlide(0);
        startHero();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupListing(listing) {
        var keywordInput = listing.querySelector("[data-filter-keyword]");
        var yearSelect = listing.querySelector("[data-filter-year]");
        var sortSelect = listing.querySelector("[data-sort-cards]");
        var container = listing.querySelector("[data-card-container]");
        var content = listing.querySelector(".listing-content");
        var viewButtons = Array.prototype.slice.call(listing.querySelectorAll("[data-view]"));

        if (!container) {
            return;
        }

        var cards = Array.prototype.slice.call(container.children);
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q") || "";
        var mainSearch = document.querySelector("[data-main-search]");

        if (q) {
            if (keywordInput) {
                keywordInput.value = q;
            }
            if (mainSearch) {
                mainSearch.value = q;
            }
        }

        function filterCards() {
            var keyword = normalize(keywordInput ? keywordInput.value : "");
            var year = yearSelect ? yearSelect.value : "";
            cards.forEach(function (card) {
                var contentText = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-year"),
                    card.textContent
                ].join(" "));
                var cardYear = card.getAttribute("data-year") || "";
                var matchedKeyword = !keyword || contentText.indexOf(keyword) !== -1;
                var matchedYear = !year || cardYear.indexOf(year) !== -1;
                card.classList.toggle("hidden-card", !(matchedKeyword && matchedYear));
            });
        }

        function sortCards() {
            var mode = sortSelect ? sortSelect.value : "heat";
            cards.sort(function (a, b) {
                if (mode === "title") {
                    return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                }
                if (mode === "year") {
                    return parseInt(b.getAttribute("data-year"), 10) - parseInt(a.getAttribute("data-year"), 10);
                }
                if (mode === "views") {
                    return parseInt(b.getAttribute("data-views"), 10) - parseInt(a.getAttribute("data-views"), 10);
                }
                return parseInt(b.getAttribute("data-heat"), 10) - parseInt(a.getAttribute("data-heat"), 10);
            });
            cards.forEach(function (card) {
                container.appendChild(card);
            });
        }

        function refresh() {
            sortCards();
            filterCards();
        }

        if (keywordInput) {
            keywordInput.addEventListener("input", filterCards);
        }
        if (yearSelect) {
            yearSelect.addEventListener("change", filterCards);
        }
        if (sortSelect) {
            sortSelect.addEventListener("change", refresh);
        }

        viewButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                viewButtons.forEach(function (item) {
                    item.classList.remove("active");
                });
                button.classList.add("active");
                if (content) {
                    content.classList.toggle("list-view", button.getAttribute("data-view") === "list");
                }
            });
        });

        refresh();
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-listing]")).forEach(setupListing);
})();
