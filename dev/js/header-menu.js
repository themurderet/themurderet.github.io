function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// Wait until DOM content is loaded AND header is inserted
document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('header-placeholder');
  
  if (headerPlaceholder) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(html => {
        headerPlaceholder.innerHTML = html;
        initMobileMenu(); // <-- initialize AFTER header is inserted
      });
  }
});
