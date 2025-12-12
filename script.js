// DOM Elements
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');
const header = document.querySelector('.navbar');

// Custom Cursor Movement
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Small dot follows immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay (animation in CSS could handle this, 
    // but JS animate gives smoother "trailing" feel)
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor Interactions
// Expand cursor when hovering over clickable elements
const clickableElements = document.querySelectorAll('a, button, .project-card, input, textarea');

clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '50px';
        cursorOutline.style.height = '50px';
        cursorOutline.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '30px';
        cursorOutline.style.height = '30px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

// Navbar Scroll Effect (Blur/Shadow increase on scroll)
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Typing Text Effect for Hero Section
const typedTextSpan = document.querySelector(".typing-text");
const textArray = ["Java Developer", "Full Stack Dev", "Tech Enthusiast"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!typedTextSpan.classList.contains("typing")) typedTextSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        typedTextSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typedTextSpan) setTimeout(type, newTextDelay + 250);
});

// Scroll Reveal Animation (Simple Intersection Observer)
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

const sections = document.querySelectorAll('.section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});

// Add 'in-view' class style dynamically for the observer logic above
// We can do this in JS or CSS. Let's append a style tag to be self-contained in JS logic if needed, 
// but it's cleaner to handle the logic here and the initial state in CSS.
// Since I already set initial opacity/transform in JS above, I'll add the event listener to handle the transition.
document.addEventListener('transitionend', (e) => {
    if (e.target.classList.contains('in-view')) {
        // Cleanup if needed
    }
});

// Injecting the class via JS based on the intersection 
// We need to actually define the class behavior since we set inline styles above
const style = document.createElement('style');
style.innerHTML = `
    .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);


// Form Handling (Web3Forms Integration)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                btn.textContent = 'Message Sent!';
                btn.style.background = 'linear-gradient(90deg, #10b981, #059669)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    btn.style.background = '';
                    contactForm.reset();
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            btn.textContent = 'Failed! Try Again';
            btn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }
    });
}
