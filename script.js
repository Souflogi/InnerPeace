// const items = document.querySelectorAll(".gallery div:has(img)"); // or .gallery img
// const animationClass = "elevated";
// const interval = 3500; // ms (1.5s per cycle)

// function animateRandomItem() {
//   // remove animation from any active item
//   items.forEach(item => item.classList.remove(animationClass));

//   // pick random
//   const randomIndex = Math.floor(Math.random() * items.length);
//   const randomItem = items[randomIndex];

//   // add class
//   randomItem.classList.add(animationClass);

//   // schedule next
//   setTimeout(animateRandomItem, interval);
// }

// // start the infinite loop
// animateRandomItem();

// this is what i added for configuring individual story carousels
function setupStoryCarousel(carousel) {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  if (!slides.length) return;

  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;

  // this is what i added for changing which slide is visible
  const showSlide = (index) => {
    const normalizedIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      if (slideIndex === normalizedIndex) {
        slide.removeAttribute("hidden");
        slide.dataset.carouselActive = "true";
      } else {
        slide.setAttribute("hidden", "");
        delete slide.dataset.carouselActive;
      }
    });
    activeIndex = normalizedIndex;
  };

  showSlide(0);

  // this is what i added for the previous button interaction
  prevButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
  });

  // this is what i added for the next button interaction
  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
  });
}

// this is what i added for bootstrapping all of the story carousels
document.addEventListener("DOMContentLoaded", () => {
  // this is what i added for finding every carousel instance
  document
    .querySelectorAll("[data-carousel]")
    .forEach((carousel) => setupStoryCarousel(carousel));
});
