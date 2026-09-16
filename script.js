const galleryItems = [...document.querySelectorAll('.gallery-item')];
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxCounter = document.getElementById('lightboxCounter');
const closeButton = document.getElementById('closeLightbox');
const previousButton = document.getElementById('prevImage');
const nextButton = document.getElementById('nextImage');

const galleryData = galleryItems.map((item) => ({
  title: item.querySelector('h3').textContent,
  category: item.dataset.category,
  image: item.querySelector('img').src,
  alt: item.querySelector('img').alt
}));

let currentIndex = 0;
let lastFocusedElement = null;

function openLightbox(index) {
  currentIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

function updateLightbox() {
  const item = galleryData[currentIndex];
  lightboxImage.src = item.image;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.title;
  lightboxCategory.textContent = item.category;
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryData.length).padStart(2, '0')}`;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryData.length;
  updateLightbox();
}

function showPrevious() {
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  updateLightbox();
}

// Open the correct image using the data-index stored on each card.
galleryItems.forEach((item) => {
  item.querySelector('.image-card').addEventListener('click', () => {
    openLightbox(Number(item.dataset.index));
  });
});

closeButton.addEventListener('click', closeLightbox);
nextButton.addEventListener('click', showNext);
previousButton.addEventListener('click', showPrevious);

// Close when clicking the dark area outside the image.
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard event handling: ESC closes, arrow keys navigate.
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showNext();
  if (event.key === 'ArrowLeft') showPrevious();
});

// Category filtering demonstrates DOM manipulation.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    galleryItems.forEach((item) => {
      const shouldShow = selectedFilter === 'all' || item.dataset.category === selectedFilter;
      item.classList.toggle('hidden', !shouldShow);
    });
  });
});
