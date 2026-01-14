// ==================== Component Loader ====================
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

// ==================== Lightbox ====================
let currentGroup = [];
let currentIndex = 0;

function openLightbox(event) {
  event.preventDefault();
  event.stopPropagation();   
  event.stopImmediatePropagation();
  
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    console.error('Lightbox not found! Make sure lightbox component is loaded.');
    return;
  }
  
  const groupName = event.currentTarget.dataset.group;
  currentGroup = Array.from(document.querySelectorAll(`[data-group="${groupName}"]`));
  currentIndex = currentGroup.indexOf(event.currentTarget);
  
  console.log('Opening lightbox:', { groupName, currentIndex, totalImages: currentGroup.length });
  
  updateLightbox();
  lightbox.classList.remove('hidden');
  lightbox.classList.add('show');
}

function updateLightbox() {
  const item = currentGroup[currentIndex];
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  console.log('Updating lightbox:', { 
    img: !!img, 
    caption: !!caption, 
    counter: !!counter,
    src: item?.getAttribute('href')
  });

  if (!img) {
    console.error('lightbox-img element not found!');
    return;
  }

  img.src = item.getAttribute('href');
  if (caption) caption.textContent = item.dataset.caption || "";
  if (counter) counter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
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

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('show');
  }
}

function initLightbox() {
  const closeBtn = document.getElementById('lightbox-close');
  const lightbox = document.getElementById('lightbox');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  if (!closeBtn || !lightbox) {
    console.error('Lightbox elements not found');
    return;
  }

  // Remove any existing listeners by cloning elements
  const newCloseBtn = closeBtn.cloneNode(true);
  closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
  
  newCloseBtn.addEventListener('click', closeLightbox);

  if (prevBtn) {
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    newPrevBtn.addEventListener('click', prevImage);
  }

  if (nextBtn) {
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    newNextBtn.addEventListener('click', nextImage);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
      closeLightbox();
    }
  });

  console.log('Lightbox initialized successfully');
}

// ==================== Mobile Menu ====================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuBtn || !mobileMenu) {
    console.log('Mobile menu elements not found');
    return;
  }

  // Remove existing event listeners by cloning
  const newBtn = mobileMenuBtn.cloneNode(true);
  mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);

  newBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
    newBtn.classList.toggle('open');
    console.log('Menu toggled:', mobileMenu.classList.contains('open'));
  });

  // Close menu when clicking links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      newBtn.classList.remove('open');
    });
  });

  console.log('Mobile menu initialized successfully');
}

// ==================== Smooth Scroll ====================
function smoothScrollTo(elementId) {
  const target = document.getElementById(elementId);
  if (!target) return;
  
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const extraPadding = -30;
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraPadding;
  
  window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

function handleNavClick(e) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.includes('#')) return;
  
  const [path, hash] = href.split('#');
  if (!hash) return;
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const targetPage = path.split('/').pop() || 'index.html';
  
  if (!path || targetPage === currentPage) {
    e.preventDefault();
    smoothScrollTo(hash);
    history.pushState(null, '', '#' + hash);
  }
}

function bindNavLinks() {
  document.querySelectorAll('nav a[href*="#"]').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
}

function scrollToHashOnLoad() {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const target = document.getElementById(hash);
    if (!target) return;
    
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const extraPadding = -30;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraPadding;
    
    window.scrollTo({ top: targetPosition, behavior: 'auto' });
  }
}

// ==================== Back to Top Button ====================
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    if (scrolled > windowHeight * 0.3) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('show')) {
    if (e.key === 'ArrowRight') nextImage(e);
    if (e.key === 'ArrowLeft') prevImage(e);
    if (e.key === 'Escape') closeLightbox();
  }
});

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', async () => {
  // Load header first and wait for it
  await loadComponent('header-placeholder', 'components/header.html');
  
  // Initialize mobile menu after header is loaded
  setTimeout(() => {
    initMobileMenu();
  }, 100);

  // Load other components
  await loadComponent('contact-placeholder', 'components/contact.html');
  await loadComponent('footer-placeholder', 'components/footer.html');

  const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
  if (lightboxPlaceholder) {
    await loadComponent('lightbox-placeholder', 'components/lightbox.html');
    setTimeout(() => {
      initLightbox();
    }, 100);
  }

  const backToTopPlaceholder = document.getElementById('back-to-top-placeholder');
  if (backToTopPlaceholder) {
    await loadComponent('back-to-top-placeholder', 'components/back-to-top.html');
    initBackToTop();
  }

  bindNavLinks();
  scrollToHashOnLoad();
});