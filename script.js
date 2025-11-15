// Initialize interactive modules once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initResponsiveMenu = () => {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    const backdrop = document.querySelector("[data-nav-backdrop]");
    const navLinks = nav.querySelectorAll("a");
    const setOpen = (isOpen) => {
      nav.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
      backdrop?.classList.toggle("is-visible", isOpen);
    };

    toggle.addEventListener("click", () => {
      const nextState = !nav.classList.contains("is-open");
      setOpen(nextState);
    });

    backdrop?.addEventListener("click", () => setOpen(false));
    navLinks.forEach((link) =>
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const isAnchorLink = targetId && targetId.startsWith("#");
        const targetSection = isAnchorLink ? document.querySelector(targetId) : null;

        if (targetSection) {
          event.preventDefault();
          targetSection.scrollIntoView({
            behavior: reduceMotionQuery.matches ? "auto" : "smooth",
            block: "start",
          });

          if (typeof window.history.pushState === "function") {
            window.history.pushState(null, "", targetId);
          } else {
            window.location.hash = targetId;
          }
        }

        setOpen(false);
      })
    );

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  };

  const initStories = () => {
    if (typeof Swiper === "undefined") return;

    // Stories carousel configuration (looping, pagination, arrows).
    new Swiper("[data-swiper-stories]", {
      loop: true,
      speed: 600,
      spaceBetween: 30,
      pagination: {
        el: ".stories__pagination",
        clickable: true,
      },
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
      // Creates a subtle wave instead of a strict incremental delay.
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

  const initStickyNav = () => {
    const headerEl = document.querySelector(".site-header");
    const heroSection = document.querySelector(".section-hero");
    if (!headerEl || !heroSection || typeof IntersectionObserver === "undefined") return;

    const desktopQuery = window.matchMedia("(min-width: 1001px)");
    let navObserver = null;

    const NavObsererCallback = (entries) => {
      const [entry] = entries;

      if (!entry.isIntersecting) {
        entry.target.style.marginTop = `${headerEl.offsetHeight}px`;
        headerEl.classList.add("sticky-header");
      } else {
        headerEl.classList.remove("sticky-header");
        entry.target.style.marginTop = "0px";
      }
    };

    const NavObsererOptions = {
      root: null,
      threshold: [0],
    };

    const detachObserver = () => {
      navObserver?.disconnect();
      navObserver = null;
      headerEl.classList.remove("sticky-header");
      heroSection.style.marginTop = "0px";
    };

    const attachObserver = () => {
      if (navObserver || !desktopQuery.matches) return;
      navObserver = new IntersectionObserver(NavObsererCallback, NavObsererOptions);
      navObserver.observe(heroSection);
    };

    attachObserver();

    desktopQuery.addEventListener("change", () => {
      detachObserver();
      attachObserver();
    });
  };

  initResponsiveMenu();
  initStories();
  initGalleryReveal();
  initScrollReveal();
  initStickyNav();
});
