// ================= MOBILE MENU =================

// Close menu on link click
mobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
  });
});

// Close menu on outside click
document.addEventListener("click", e => {
  if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove("show");
  }
});

// ================= WHATSAPP BOOKING =================
function sendWhatsApp(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const room = document.getElementById("room").value;
  const message = document.getElementById("message").value;

  const text =
    `Booking Request:%0A` +
    `Name: ${name}%0A` +
    `Date: ${date}%0A` +
    `Room: ${room}%0A` +
    `Message: ${message}`;

  window.open(`https://wa.me/+94784447773?text=${text}`, "_blank");
}


// ================= REVIEWS SLIDER =================

const slider = document.getElementById("reviewSlider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("dots");

let interval;
let startX = 0;
let isDragging = false;

// Helpers
function slideWidth() {
  return slider.children[0].offsetWidth + 24;
}

function visibleCount() {
  const viewport = slider.parentElement.offsetWidth;
  return Math.round(viewport / slideWidth());
}

function setTransition(on = true) {
  slider.style.transition = on ? "transform 0.7s ease-in-out" : "none";
}

function move() {
  slider.style.transform = `translateX(-${index * slideWidth()}px)`;
}

// ================= CLONE LOGIC =================

const originalCards = Array.from(slider.children);
const clonesCount = visibleCount();

// Clone last N → start
for (let i = originalCards.length - clonesCount; i < originalCards.length; i++) {
  slider.insertBefore(originalCards[i].cloneNode(true), slider.firstChild);
}

// Clone first N → end
for (let i = 0; i < clonesCount; i++) {
  slider.appendChild(originalCards[i].cloneNode(true));
}

let index = clonesCount;

// Recalculate slides AFTER cloning
const slides = slider.children;

// ================= CONTROLS =================

function next() {
  index++;
  setTransition(true);
  move();

  if (index >= slides.length - clonesCount) {
    setTimeout(() => {
      setTransition(false);
      index = clonesCount;
      move();
    }, 700);
  }
}

function prev() {
  index--;
  setTransition(true);
  move();

  if (index < clonesCount) {
    setTimeout(() => {
      setTransition(false);
      index = slides.length - clonesCount * 2;
      move();
    }, 700);
  }
}

// ================= AUTOPLAY =================

function startAuto() {
  stopAuto();
  interval = setInterval(next, 4000);
}

function stopAuto() {
  if (interval) clearInterval(interval);
}

// ================= DOTS =================

originalCards.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.onclick = () => {
    index = i + clonesCount;
    setTransition(true);
    move();
  };
  dotsContainer.appendChild(dot);
});

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", index === i + clonesCount);
  });
}

slider.addEventListener("transitionend", updateDots);

// ================= INTERACTION =================

// Pause on hover / touch
slider.addEventListener("mouseenter", stopAuto);
slider.addEventListener("mouseleave", startAuto);
slider.addEventListener("touchstart", stopAuto);
slider.addEventListener("touchend", startAuto);

// Swipe
slider.addEventListener("mousedown", e => {
  startX = e.clientX;
  isDragging = true;
  stopAuto();
});

slider.addEventListener("mouseup", e => {
  if (!isDragging) return;
  isDragging = false;

  if (e.clientX - startX > 50) prev();
  if (startX - e.clientX > 50) next();

  startAuto();
});

slider.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) prev();
  if (startX - endX > 50) next();
});

// Arrows
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

// ================= INIT =================

setTransition(false);
move();
updateDots();
startAuto();


