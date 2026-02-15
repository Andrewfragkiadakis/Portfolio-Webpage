// Initialize current language and scroll position - Tracks state
let currentLang = 'en';        // Starts with English
let lastScrollTop = 0;         // Tracks last scroll position

// Function to toggle between English and Greek content
function toggleLanguage() {
    const enContent = document.querySelector('.content.en'); // English content div
    const grContent = document.querySelector('.content.gr'); // Greek content div
    if (currentLang === 'en') { // If English is active
        enContent.classList.add('hidden');      // Hide English
        enContent.classList.remove('active');   // Remove active state
        grContent.classList.remove('hidden');   // Show Greek
        grContent.classList.add('active');      // Set Greek as active
        currentLang = 'gr';                     // Update language
        document.getElementById('language-text').textContent = 'EN/GR'; // Update button text
    } else { // If Greek is active
        grContent.classList.add('hidden');      // Hide Greek
        grContent.classList.remove('active');   // Remove active state
        enContent.classList.remove('hidden');   // Show English
        enContent.classList.add('active');      // Set English as active
        currentLang = 'en';                     // Update language
        document.getElementById('language-text').textContent = 'GR/EN'; // Update button text
    }
}

// Function to toggle between light and dark themes
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme'); // Get current theme
    if (currentTheme === 'dark') { // If dark mode is active
        document.documentElement.removeAttribute('data-theme'); // Switch to light
        document.querySelector('.theme-toggle').innerHTML = '<i class="fas fa-moon" style="color: var(--icon-color);"></i><span>Night Mode</span>'; // Update button
    } else { // If light mode is active
        document.documentElement.setAttribute('data-theme', 'dark'); // Switch to dark
        document.querySelector('.theme-toggle').innerHTML = '<i class="fas fa-sun" style="color: var(--icon-color);"></i><span>Light Mode</span>'; // Update button
    }
}

// Hide/show toggle buttons on scroll - Controls button visibility
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop; // Current scroll position
    if (scrollTop > lastScrollTop) { // Scrolling down
        document.querySelector('.theme-toggle').classList.add('hide-on-scroll'); // Hide theme button
        document.querySelector('.lang-toggle').classList.add('hide-on-scroll');  // Hide language button
    } else { // Scrolling up
        document.querySelector('.theme-toggle').classList.remove('hide-on-scroll'); // Show theme button
        document.querySelector('.lang-toggle').classList.remove('hide-on-scroll');  // Show language button
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Update last scroll position
}, false);

// Animate skill bars on page load - Triggers progress bar animation
window.onload = function() {
    const fills = document.querySelectorAll('.skill-fill'); // All skill bars
    fills.forEach(fill => fill.classList.add('animate'));   // Add animation class
};

// Toggle "see more" for English experience - Expands/collapses extra content
document.getElementById('see-more-btn-en').addEventListener('click', function() {
    const moreExperience = document.getElementById('more-experience-en'); // Extra experience div
    if (moreExperience.classList.contains('expanded')) { // If expanded
        moreExperience.classList.remove('expanded');     // Collapse it
        this.innerHTML = 'See More <i class="fas fa-arrow-down"></i>'; // Update button text
    } else { // If collapsed
        moreExperience.classList.add('expanded');        // Expand it
        this.innerHTML = 'See Less <i class="fas fa-arrow-up"></i>'; // Update button text
    }
});

// Toggle "see more" for Greek experience - Expands/collapses extra content
document.getElementById('see-more-btn-gr').addEventListener('click', function() {
    const moreExperience = document.getElementById('more-experience-gr'); // Extra experience div
    if (moreExperience.classList.contains('expanded')) { // If expanded
        moreExperience.classList.remove('expanded');     // Collapse it
        this.innerHTML = 'Δείτε Περισσότερα <i class="fas fa-arrow-down"></i>'; // Update button text
    } else { // If collapsed
        moreExperience.classList.add('expanded');        // Expand it
        this.innerHTML = 'Δείτε Λιγότερα <i class="fas fa-arrow-up"></i>'; // Update button text
    }
});