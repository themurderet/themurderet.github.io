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

// ==================== Smooth Scroll ====================
function smoothScrollTo(elementId) {
  const target = document.getElementById(elementId);
  if (!target) return;
  
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const extraPadding = -30; // Negative value scrolls higher
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
  
  // Same page navigation - scroll smoothly
  if (!path || targetPage === currentPage) {
    e.preventDefault();
    smoothScrollTo(hash);
    history.pushState(null, '', '#' + hash);
  }
  // Cross-page navigation - let browser navigate, then scroll on load
  // (handled by scrollToHashOnLoad)
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
    
    // Jump directly without animation when arriving from external page
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const extraPadding = -30; // Negative value scrolls higher
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraPadding;
    
    window.scrollTo({ top: targetPosition, behavior: 'auto' });
  }
}

// ==================== Back to Top Button ====================
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;
  
  // Show/hide based on scroll position
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
  
  // Scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('header-placeholder', 'components/header.html');
  await loadComponent('contact-placeholder', 'components/contact.html');
  await loadComponent('footer-placeholder', 'components/footer.html');
  
  const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
  if (lightboxPlaceholder) {
    await loadComponent('lightbox-placeholder', 'components/lightbox.html');
  }
  
  // Load back to top button
  const backToTopPlaceholder = document.getElementById('back-to-top-placeholder');
  if (backToTopPlaceholder) {
    await loadComponent('back-to-top-placeholder', 'components/back-to-top.html');
    initBackToTop();
  }
  
  bindNavLinks();
  scrollToHashOnLoad();
});