document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
        observer.observe(el);
    });

    // Animated counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                animateValue(target, 0, endValue, 2000);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value + (obj.getAttribute('data-suffix') || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Testimonial Dots (Simple implementation)
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            // In a real carousel, this would move the slider
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                mobileMenu.classList.remove('active');
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Event Modal Logic
    const modal = document.getElementById('eventModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalVenue = document.getElementById('modalVenue');
    const modalDesc = document.getElementById('modalDesc');
    const modalTag = document.getElementById('modalTag');
    const closeBtn = document.querySelector('.modal-close');

    if (modal) {
        document.querySelectorAll('.event-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevent modal if clicking carousel buttons
                if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot')) return;

                try {
                    const imgs = Array.from(card.querySelectorAll('.carousel-slide img')).map(img => img.src);
                    // Fallback for non-carousel cards
                    const singleImg = card.querySelector('.event-card-image img')?.src;
                    const imageList = imgs.length > 0 ? imgs : (singleImg ? [singleImg] : []);

                    const title = card.querySelector('.event-card-title')?.innerText || '';
                    const date = card.querySelector('.event-card-date')?.innerText || '';
                    const venue = card.querySelector('.event-card-venue')?.innerHTML || '';
                    const desc = card.querySelector('.event-card-desc')?.innerText || '';
                    const tag = card.querySelector('.event-tag')?.innerText || '';

                    // Populate Modal Carousel
                    const modalTrack = document.getElementById('modalCarouselTrack');
                    const modalDots = document.getElementById('modalCarouselDots');
                    if (modalTrack && modalDots) {
                        modalTrack.innerHTML = '';
                        modalDots.innerHTML = '';
                        modalTrack.style.transform = 'translateX(0)';
                        window.modalCurrentIndex = 0;

                        imageList.forEach((src, i) => {
                            const slide = document.createElement('div');
                            slide.classList.add('carousel-slide');
                            slide.innerHTML = `<img src="${src}" alt="${title} ${i+1}">`;
                            modalTrack.appendChild(slide);

                            const dot = document.createElement('div');
                            dot.classList.add('carousel-dot');
                            if (i === 0) dot.classList.add('active');
                            dot.onclick = () => goToModalSlide(i);
                            modalDots.appendChild(dot);
                        });

                        const nav = modal.querySelector('.carousel-nav');
                        if (imageList.length <= 1) {
                            if (nav) nav.style.display = 'none';
                            modalDots.style.display = 'none';
                        } else {
                            if (nav) nav.style.display = 'flex';
                            modalDots.style.display = 'flex';
                        }
                    }

                    if (modalTitle) modalTitle.innerText = title;
                    if (modalDate) modalDate.innerText = date;
                    if (modalVenue) modalVenue.innerHTML = venue;
                    if (modalDesc) modalDesc.innerText = desc;
                    
                    if (modalTag) {
                        if (tag) {
                            modalTag.innerText = tag;
                            modalTag.style.display = 'inline-block';
                        } else {
                            modalTag.style.display = 'none';
                        }
                    }

                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';

                    // Start modal auto-slide
                    if (window.modalAutoSlide) clearInterval(window.modalAutoSlide);
                    if (imageList.length > 1) {
                        window.modalAutoSlide = setInterval(() => goToModalSlide(window.modalCurrentIndex + 1), 3000);
                    }
                } catch (err) {
                    console.error('Error opening modal:', err);
                }
            });
        });

        const closeModal = () => {
            if (window.modalAutoSlide) clearInterval(window.modalAutoSlide);
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }
});
// Global Modal Functions
window.openBookingModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeBookingModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Global Escape Key Listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const eventModal = document.getElementById('eventModal');
        const bookingModal = document.getElementById('bookingModal');
        if (eventModal) eventModal.classList.remove('active');
        if (bookingModal) bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Back to Top Visibility
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        if (backToTop) backToTop.classList.add('visible');
    } else {
        if (backToTop) backToTop.classList.remove('visible');
    }
});

// Ticker Center Highlight Logic
function updateTickerHighlight() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    const logos = track.querySelectorAll('.ticker-logo');
    const centerX = window.innerWidth / 2;

    logos.forEach(logo => {
        const rect = logo.getBoundingClientRect();
        const logoCenter = rect.left + rect.width / 2;
        const distanceFromCenter = Math.abs(centerX - logoCenter);

        // Highlight if within 100px of center
        if (distanceFromCenter < 100) {
            logo.classList.add('center-highlight');
        } else {
            logo.classList.remove('center-highlight');
        }
    });

    requestAnimationFrame(updateTickerHighlight);
}

document.addEventListener('DOMContentLoaded', () => {
    updateTickerHighlight();
});

// Event Card Carousel Logic
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = carousel.querySelector('.next');
        const prevBtn = carousel.querySelector('.prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        
        let currentIndex = 0;
        
        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dotsNav.appendChild(dot);
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
        });
        
        const dots = Array.from(dotsNav.children);
        
        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };
        
        const goToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            currentIndex = index;
            updateDots(currentIndex);
        };
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentIndex + 1);
        });
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentIndex - 1);
        });

        // Auto-slide every 5 seconds
        let autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);

        carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
        carousel.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
});

// Modal Carousel Controls
window.modalCurrentIndex = 0;
function goToModalSlide(index) {
    const track = document.getElementById('modalCarouselTrack');
    const dots = document.querySelectorAll('#modalCarouselDots .carousel-dot');
    const slides = track.querySelectorAll('.carousel-slide');
    
    if (!track || slides.length === 0) return;
    
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    window.modalCurrentIndex = index;
    
    if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }
}

// Attach modal nav listeners once
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.querySelector('.next')?.addEventListener('click', (e) => {
            e.stopPropagation();
            goToModalSlide(window.modalCurrentIndex + 1);
        });
        modal.querySelector('.prev')?.addEventListener('click', (e) => {
            e.stopPropagation();
            goToModalSlide(window.modalCurrentIndex - 1);
        });
    }
});
