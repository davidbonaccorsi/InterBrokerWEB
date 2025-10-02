/*
 * Global client‑side behaviour for Inter Broker De Asigurare.
 *
 * This script enhances interactivity across the site.  It handles
 * opening and closing the mobile navigation drawer, switching
 * between the “Persoane Fizice” and “Persoane Juridice” panels in
 * both the home page selector and the header mega menu, and animates
 * the statistics counters when they scroll into view.  Feel free to
 * extend this file with additional functionality (e.g. testimonial
 * sliders, form validation) as the site evolves.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
    // Close drawer when tapping outside nav panel
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('open');
      }
    });
  }

  // Home page product selector (Persoane Fizice/Juridice)
  const psTabs = document.querySelectorAll('.ps-tabs button');
  const psPanels = document.querySelectorAll('.ps-content');
  psTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      psTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      psPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.classList.contains(target));
      });
    });
  });

  // Header mega menu tab switching
  const megaMenu = document.querySelector('.mega-menu');
  if (megaMenu) {
    const megaTabs = megaMenu.querySelectorAll('.mega-tabs button');
    const megaSections = megaMenu.querySelectorAll('.mega-content');
    megaTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const target = tab.dataset.target;
        megaTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        megaSections.forEach((sec) => {
          sec.style.display = sec.classList.contains(target) ? 'grid' : 'none';
        });
      });
    });
    // Initialise with first tab active
    if (megaTabs.length > 0) {
      megaTabs[0].click();
    }
  }

  // Toggle mega menu on click of "Servicii" link on small screens
  const servicesLink = document.querySelector('nav li.services > a');
  if (servicesLink && megaMenu) {
    servicesLink.addEventListener('click', (e) => {
      // Prevent default navigation for the placeholder link
      e.preventDefault();
      // Only toggle on narrow viewports (mobile).  On desktop the menu
      // opens on hover via CSS, so we do nothing here.
      if (window.innerWidth < 992) {
        // If the menu is already visible hide it, otherwise show it
        const isShown = megaMenu.style.display === 'grid' || megaMenu.classList.contains('open');
        if (isShown) {
          megaMenu.style.display = 'none';
          megaMenu.classList.remove('open');
          // update aria-expanded for accessibility
          servicesLink.setAttribute('aria-expanded', 'false');
        } else {
          megaMenu.style.display = 'grid';
          megaMenu.classList.add('open');
          servicesLink.setAttribute('aria-expanded', 'true');
        }
      }
    });
    // When a product item is clicked on mobile, close the mega menu after navigation
    megaMenu.querySelectorAll('a.product-item').forEach((item) => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          megaMenu.style.display = 'none';
          megaMenu.classList.remove('open');
          servicesLink.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Reveal animation: observe elements with the `.reveal` class and add
  // `in-view` when they intersect the viewport.  A lower threshold
  // makes the content animate sooner as it starts to enter the viewport,
  // improving the timing on mobile where the text might otherwise
  // appear too late (especially in the partner hero).  The
  // `in-view` class remains until the element scrolls out of view.
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          // Remove the class when scrolling away to reset the animation
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // On narrow viewports, reveal service card overlays as they scroll into view.
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length > 0 && window.innerWidth < 992) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('active', entry.isIntersecting);
      });
    }, { threshold: 0.4 });
    serviceCards.forEach((card) => cardObserver.observe(card));
  }

  // Animate statistics counters when they enter the viewport
  const counters = document.querySelectorAll('.stat-number');
  const options = { threshold: 0.6 };
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
    const duration = 1200; // milliseconds
    let start = null;
    const initial = 0;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * (target - initial) + initial);
      el.textContent = value.toLocaleString('ro-RO');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, options);
  counters.forEach((el) => {
    observer.observe(el);
  });

  // Toggle display of the mobile services list when tapping the
  // "Servicii" link inside the mobile navigation.  The previous
  // implementation targeted a hard‑coded href; this now selects the
  // explicit `.mobile-services-toggle` class used on the mobile nav
  // link.  Toggling the `open` class reveals the category section
  // directly beneath the services link.
  const mobileServicesToggle = document.querySelector('.mobile-nav .mobile-services-toggle');
  const mobileServicesList = document.querySelector('.mobile-nav .mobile-services');
  if (mobileServicesToggle && mobileServicesList) {
    mobileServicesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileServicesList.classList.toggle('open');
    });
  }

  // Within the mobile services list, each category heading acts as a
  // toggle for its associated sublist.  Only one sublist can be
  // expanded at a time to avoid cluttering the limited screen space.
  const mobileCategoryHeadings = document.querySelectorAll('.mobile-category h4');
  if (mobileCategoryHeadings.length > 0) {
    mobileCategoryHeadings.forEach((heading) => {
      heading.addEventListener('click', () => {
        const target = heading.dataset.target;
        const sublists = document.querySelectorAll('.mobile-sublist');
        sublists.forEach((list) => {
          if (list.classList.contains(target)) {
            const isOpen = list.classList.contains('open');
            // Close all lists first
            sublists.forEach((l) => l.classList.remove('open'));
            // Toggle current list only if it wasn't open
            if (!isOpen) list.classList.add('open');
          } else {
            list.classList.remove('open');
          }
        });
      });
    });
  }
});