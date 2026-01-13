// Lightbox functionality
let currentGroup = [];
let currentIndex = 0;

function openLightbox(event) {
  event.preventDefault();
  const groupName = event.currentTarget.dataset.group;
  currentGroup = Array.from(document.querySelectorAll(`[data-group="${groupName}"]`));
  currentIndex = currentGroup.indexOf(event.currentTarget);
  updateLightbox();
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('hidden');
  lightbox.classList.add('show');
}

function updateLightbox() {
  const item = currentGroup[currentIndex];
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  img.src = item.getAttribute('href');
  caption.textContent = item.dataset.caption || "";
  counter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
}

function nextImage(event) {
  event.stopPropagation();
  currentIndex = (currentIndex + 1) % currentGroup.length;
  updateLightbox();
}

function prevImage(event) {
  event.stopPropagation();
  currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
  updateLightbox();
}

// Close lightbox events
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('lightbox-close').addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.classList.remove('show');
  });

  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
      document.getElementById('lightbox').classList.add('hidden');
      document.getElementById('lightbox').classList.remove('show');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('show')) {
      if (e.key === 'ArrowRight') nextImage(e);
      if (e.key === 'ArrowLeft') prevImage(e);
      if (e.key === 'Escape') {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('show');
      }
    }
  });
});