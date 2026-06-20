(function () {
    const header = document.getElementById("site-header");
    const menuButton = document.querySelector(".menu-button");
    const mobileNav = document.querySelector(".mobile-nav");

    const updateHeader = function () {
        if (!header) {
            return;
        }

        if (window.scrollY > 30) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            const open = mobileNav.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    const sliders = document.querySelectorAll("[data-hero-slider]");

    sliders.forEach(function (slider) {
        const slides = Array.from(slider.querySelectorAll(".hero-slide"));
        const dots = Array.from(slider.querySelectorAll(".hero-dot"));
        const previous = slider.querySelector(".hero-prev");
        const next = slider.querySelector(".hero-next");
        let current = slides.findIndex(function (slide) {
            return slide.classList.contains("is-active");
        });

        if (current < 0) {
            current = 0;
        }

        const setSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                setSlide(index);
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
                setSlide(current - 1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                setSlide(current + 1);
            });
        }

        window.setInterval(function () {
            setSlide(current + 1);
        }, 6500);
    });

    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get("q") || "";
    const filterInputs = Array.from(document.querySelectorAll(".filter-input"));
    const cards = Array.from(document.querySelectorAll(".searchable-grid .movie-card"));

    const applyFilter = function (value) {
        const keyword = value.trim().toLowerCase();

        cards.forEach(function (card) {
            const text = [
                card.dataset.title || "",
                card.dataset.genre || "",
                card.dataset.region || "",
                card.dataset.tags || "",
                card.textContent || ""
            ].join(" ").toLowerCase();

            card.classList.toggle("is-hidden", Boolean(keyword) && !text.includes(keyword));
        });
    };

    filterInputs.forEach(function (input) {
        if (queryFromUrl && !input.value) {
            input.value = queryFromUrl;
        }

        input.addEventListener("input", function () {
            applyFilter(input.value);
        });
    });

    if (queryFromUrl) {
        applyFilter(queryFromUrl);
    }
})();
