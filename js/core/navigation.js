
// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    function isMobileViewport() {
        return mobileMediaQuery.matches;
    }

    function setMenuAriaState(isOpen) {
        if (!menuToggle || !mobileNav) return;

        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú principal' : 'Abrir menú principal');

        if (isMobileViewport()) {
            mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        } else {
            mobileNav.setAttribute('aria-hidden', 'true');
        }
    }

    function abrirMenu() {
        if (!menuToggle || !mobileNav) return;
        menuToggle.classList.add('active');
        mobileNav.classList.add('active');
        setMenuAriaState(true);
    }

    function cerrarMenu(returnFocus = false) {
        if (!menuToggle || !mobileNav) return;
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        setMenuAriaState(false);

        if (returnFocus) {
            menuToggle.focus();
        }
    }

    // Mobile menu toggle
    if (menuToggle && mobileNav) {
        setMenuAriaState(false);

        menuToggle.addEventListener('click', function() {
            const isOpen = mobileNav.classList.contains('active');
            if (isOpen) {
                cerrarMenu(false);
            } else {
                abrirMenu();
            }
        });

        // Close menu when clicking on a link
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                cerrarMenu(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (header && !header.contains(event.target) && mobileNav.classList.contains('active')) {
                cerrarMenu(false);
            }
        });

        // Keyboard support: close on Escape, keep focus inside mobile open menu
        document.addEventListener('keydown', function(event) {
            const isOpen = mobileNav.classList.contains('active');
            if (!isOpen) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                cerrarMenu(true);
                return;
            }

            if (event.key === 'Tab' && isMobileViewport()) {
                const focusableElements = [menuToggle, ...mobileNav.querySelectorAll('a[href]')];
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Keep ARIA state synchronized on viewport changes
        window.addEventListener('resize', function() {
            if (!isMobileViewport()) {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            setMenuAriaState(mobileNav.classList.contains('active'));
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
