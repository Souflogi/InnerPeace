// this is what i added for initializing the stories Swiper instance
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initStories = () => {
    if (typeof Swiper === "undefined") return;

    new Swiper("[data-swiper-stories]", {
      loop: true,
      // this is what i added for controlling animation timing
      speed: 600,
      spaceBetween: 30,
      // this is what i added for enabling pagination dots
      pagination: {
        el: ".stories__pagination",
        clickable: true,
      },
      // this is what i added for enabling navigation arrows
      navigation: {
        nextEl: ".stories__button--next",
        prevEl: ".stories__button--prev",
      },
    });
  };

  const initGalleryReveal = () => {
    const galleryItems = document.querySelectorAll(".gallery__item");
    if (!galleryItems.length) return;

    const setDelay = (item, index) => {
      // creates a subtle wave instead of a strict incremental delay
      const cycle = 4;
      const delay = (index % cycle) * 140 + Math.floor(index / cycle) * 60;
      item.style.setProperty("--gallery-delay", `${delay}ms`);
    };

    const showAll = () => {
      galleryItems.forEach((item, index) => {
        setDelay(item, index);
        item.classList.add("is-visible");
      });
    };

    if (reduceMotionQuery.matches || typeof IntersectionObserver === "undefined") {
      showAll();
      return;
    }

    const galleryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          galleryObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    galleryItems.forEach((item, index) => {
      setDelay(item, index);
      galleryObserver.observe(item);
    });

    reduceMotionQuery.addEventListener("change", (event) => {
      if (!event.matches) return;
      showAll();
      galleryObserver.disconnect();
    });
  };

  const initScrollReveal = () => {
    const revealTargets = document.querySelectorAll("[data-reveal]");
    if (!revealTargets.length) return;

    revealTargets.forEach((target) => {
      const { revealDelay } = target.dataset;
      if (revealDelay) {
        target.style.setProperty("--reveal-delay", `${revealDelay}ms`);
      }
    });

    const showAll = () => {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
    };

    if (reduceMotionQuery.matches || typeof IntersectionObserver === "undefined") {
      showAll();
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));

    reduceMotionQuery.addEventListener("change", (event) => {
      if (!event.matches) return;
      showAll();
      revealObserver.disconnect();
    });
  };

  initStories();
  initGalleryReveal();
  initScrollReveal();
});
