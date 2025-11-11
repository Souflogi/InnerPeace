// this is what i added for initializing the stories Swiper instance
document.addEventListener("DOMContentLoaded", () => {
  // this is what i added for ensuring Swiper is available before running
  if (typeof Swiper === "undefined") return;

  // this is what i added for creating the stories Swiper with navigation and pagination
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
});
