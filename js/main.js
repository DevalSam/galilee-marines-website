// ===================================
// GALILEE MARINES LTD MAIN JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeHeroCarousel();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    
    console.log('Galilee Marines website initialized successfully');
});

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Navbar scroll effect
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active navigation highlight
    highlightActiveNavigation();
}

// ===================================
// HERO CAROUSEL FUNCTIONALITY
// ===================================

function initializeHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(function() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000); // Change slide every 5 seconds
    }
    
    // Stop automatic slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlideshow();
            setTimeout(startSlideshow, 3000); // Restart after 3 seconds
        });
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroSection.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                currentSlide = (currentSlide + 1) % slides.length;
            } else {
                // Swipe right - previous slide
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            }
            showSlide(currentSlide);
            stopSlideshow();
            setTimeout(startSlideshow, 3000);
        }
    }
    
    // Pause slideshow on hover
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        heroCarousel.addEventListener('mouseenter', stopSlideshow);
        heroCarousel.addEventListener('mouseleave', startSlideshow);
    }
    
    // Start the slideshow
    startSlideshow();
}

// ===================================
// SCROLL EFFECTS AND ANIMATIONS
// ===================================

function initializeScrollEffects() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
    
    // Counter animation for stats
    animateCounters();
}

// ===================================
// INTERSECTION OBSERVER ANIMATIONS
// ===================================

function initializeAnimations() {
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stats-section')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .project-card, .stats-section');
    animateElements.forEach(el => observer.observe(el));
}

// ===================================
// COUNTER ANIMATION
// ===================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        if (counter.classList.contains('animated')) return;
        
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/[0-9]+/, target);
                clearInterval(timer);
                counter.classList.add('animated');
            } else {
                counter.textContent = counter.textContent.replace(/[0-9]+/, Math.floor(current));
            }
        }, 16);
    });
}

// ===================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ===================================

function highlightActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 200; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === '' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// CONTACT FORM FUNCTIONALITY
// ===================================

function initializeContactForm() {
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(function() {
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
}

// ===================================
// FORM VALIDATION
// ===================================

function validateForm(data) {
    let isValid = true;
    const errors = [];
    
    // Required fields validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
        isValid = false;
    }
    
    // Show errors if any
    if (!isValid) {
        showNotification(errors.join('<br>'), 'error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => hideNotification(notification), 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => hideNotification(notification));
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Loading state management
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.remove();
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-related functionality
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'images/hero/hero-marine-1.jpg',
        'images/hero/hero-construction-2.jpg',
        'images/hero/hero-offshore-3.jpg',
        'images/logos/galilee-marines-logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send error reports to your analytics service here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===================================
// EXPORT FOR MODULE USAGE (if needed)
// ===================================

// If using modules, you can export these functions
// export { initializeNavigation, initializeHeroCarousel, showNotification };