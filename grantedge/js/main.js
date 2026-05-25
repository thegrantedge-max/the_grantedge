/**
 * GRANTEdge Main JavaScript
 * Handles Navigation, Scroll Effects, and Form Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // MOBILE NAVIGATION TOGGLE
    // =========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                document.body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // STICKY NAVBAR ON SCROLL
    // =========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (navbar) navbar.classList.add('scrolled');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
        }
    });

    // =========================================
    // FADE-IN ANIMATIONS ON SCROLL
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Only animate these specific lightweight elements
    // DO NOT animate service-block, segment-block, or team-profile
    // Those contain critical content that must always be visible
    const animateElements = document.querySelectorAll(
        '.gap-card, .pillar-card, .service-card, .team-preview-card, .serve-card, .value-card, .diff-card, .blog-card, .process-step'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // =========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#top') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // FORM HANDLING WITH FORMSPREE
    // =========================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation styling
        const allInputs = form.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('input-error');
                    input.classList.remove('input-valid');
                } else if (input.value.trim()) {
                    input.classList.remove('input-error');
                    input.classList.add('input-valid');
                }
            });

            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                if (input.value.trim()) {
                    input.classList.add('input-valid');
                } else {
                    input.classList.remove('input-valid');
                }
            });
        });

        // Form submission handling
        form.addEventListener('submit', function(e) {
            const requiredInputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;
            let firstInvalid = null;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('input-error');
                    if (!firstInvalid) firstInvalid = input;
                } else {
                    input.classList.remove('input-error');
                }
            });

            // Email validation
            const emailInputs = form.querySelectorAll('input[type="email"]');
            emailInputs.forEach(email => {
                if (email.value.trim() && !isValidEmail(email.value.trim())) {
                    isValid = false;
                    email.classList.add('input-error');
                    if (!firstInvalid) firstInvalid = email;
                }
            });

            if (!isValid) {
                e.preventDefault();
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                showFormMessage(form, 'Please fill in all required fields correctly.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                // Re-enable after 5 seconds as fallback
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 5000);
            }
        });
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(form, message, type) {
        // Remove any existing messages
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = 'form-message form-message-' + type;
        msgDiv.textContent = message;
        
        // Insert at the top of the form
        form.insertBefore(msgDiv, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.style.opacity = '0';
                setTimeout(() => msgDiv.remove(), 300);
            }
        }, 5000);
    }

    // =========================================
    // ACCORDION LOGIC (FAQ)
    // =========================================
    const details = document.querySelectorAll('details');
    details.forEach((targetDetail) => {
        targetDetail.addEventListener('toggle', () => {
            if (targetDetail.open) {
                details.forEach((detail) => {
                    if (detail !== targetDetail && detail.open) {
                        detail.removeAttribute('open');
                    }
                });
            }
        });
    });

    // =========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // =========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});