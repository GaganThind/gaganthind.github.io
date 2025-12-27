const initDarkMode = () => {
    const toggleMode = document.querySelector("#toggleMode");
    const toggleLabel = document.querySelector("#toggleLabel");
    const sunIcon = document.querySelector(".fa-sun");
    const moonIcon = document.querySelector(".fa-moon");

    const applyColorMode = (isDark) => {
        sunIcon.style.display = isDark ? "inline" : "none";
        moonIcon.style.display = isDark ? "none" : "inline";
        const mode = isDark ? "dark" : "light";
        document.documentElement.setAttribute("color-mode", mode);
        localStorage.setItem("color-mode", mode);
    };

    // Check user preference
    const storedMode = localStorage.getItem("color-mode");
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = storedMode === "dark" || (prefersDarkMode && !storedMode);

    toggleMode.checked = isDarkMode;
    applyColorMode(isDarkMode);

    // Enable dark mode button. This has been disabled by default incase, user has explicitly blocked javascript. 
    toggleLabel.style.display = "flex";

    // Add change event listener
    toggleMode.addEventListener('change', (e) => applyColorMode(e.target.checked));
};

const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorker.js');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initServiceWorker();
    initDarkMode();
});