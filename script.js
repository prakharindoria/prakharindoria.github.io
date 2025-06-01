document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle'); 
    const htmlEl = document.documentElement;
    const profileImgElement = document.querySelector('.profile-image');
    
    // Add dark-theme-active class to button based on initial theme
    // This class is used by CSS for specific hover effects on the button itself
    if (themeToggle && htmlEl.classList.contains('dark')) {
        themeToggle.classList.add('dark-theme-active');
    } else if (themeToggle) {
        themeToggle.classList.remove('dark-theme-active');
    }

    // Function to update the placeholder image source based on the current theme
    function updateProfileImagePlaceholder() {
        if (profileImgElement && profileImgElement.getAttribute('src').startsWith('https://placehold.co')) {
            const isDark = htmlEl.classList.contains('dark');
            const placeholderColors = isDark ? '0A0A0A/F5F5F5' : 'E0E7EF/1A2233';
            profileImgElement.src = `https://placehold.co/150x150/${placeholderColors}?text=PI`;
        }
    }
    
    // Function to set the theme
    function setTheme(isDark) {
        if (isDark) {
            htmlEl.classList.add('dark');
            if (themeToggle) themeToggle.classList.add('dark-theme-active'); 
        } else {
            htmlEl.classList.remove('dark');
            if (themeToggle) themeToggle.classList.remove('dark-theme-active'); 
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateProfileImagePlaceholder(); // Update placeholder on theme change
    }

    // Function to get preferred theme (from localStorage or system settings)
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches; // Use system preference
    }

    // Initial theme setup
    const initialThemeIsDark = getPreferredTheme();
    setTheme(initialThemeIsDark);

    // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
         if (!localStorage.getItem('theme')) { // Only if no explicit user choice
            setTheme(e.matches);
        }
    });

    // Theme toggle button event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentIsDark = htmlEl.classList.contains('dark');
            setTheme(!currentIsDark);
        });
    }
    
    // Fallback for profile image if it fails to load
    if (profileImgElement) {
        profileImgElement.onerror = function() {
            this.onerror=null; // prevent infinite loop if placeholder also fails
            updateProfileImagePlaceholder(); 
        };
         // Initial check in case the image was already broken before JS ran
        if (profileImgElement.complete && !profileImgElement.naturalWidth) {
            updateProfileImagePlaceholder();
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId !== '#') { // Ensure targetId is not just "#"
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 
                    const navbarHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                    // Close mobile menu if a link in it is clicked
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (this.closest('#mobile-menu') && mobileMenu) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            } else if (targetId === '#') { // Link to top of page
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                 const mobileMenu = document.getElementById('mobile-menu');
                if (this.closest('#mobile-menu') && mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }


    // Profile image 360 spin on initial load
    if (profileImgElement) {
        profileImgElement.classList.add('profile-spin-initial');
        profileImgElement.addEventListener('animationend', function handler() {
            profileImgElement.classList.remove('profile-spin-initial');
            profileImgElement.removeEventListener('animationend', handler);
        }, { once: true }); // Use { once: true } for self-removing listener
    }

    // Initialize Rellax for parallax effect if it's loaded
    if (window.Rellax) {
        new Rellax('.rellax', {
            // Rellax options can go here if needed
        }); 
    }
    
    // Intersection Observer for fade-in sections and cards
    const animatedElements = document.querySelectorAll('.fade-in-section, .card-animate');
    const observerCallback = (entries, observerInstance) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Apply a slight delay based on the element's order in the NodeList for a staggered effect
                // The delay is more pronounced for elements with 'card-animate'
                let delay = entry.target.classList.contains('card-animate') ? index * 100 : index * 50;
                 if (entry.target.closest('#skills')) delay = index * 30; // Faster stagger for skills tags

                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observerInstance.unobserve(entry.target);
            }
        });
    };
    const sectionObserver = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    animatedElements.forEach(el => sectionObserver.observe(el));

    // Intersection Observer for Section Titles
    const titleElements = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    titleElements.forEach(title => titleObserver.observe(title));


    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); 