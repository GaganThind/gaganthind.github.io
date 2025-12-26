const initDarkMode = () => {
    const toggleMode = document.querySelector("#toggleMode");
    const toggleLabel = document.querySelector("#toggleLabel");
    const sunIcon = document.querySelector(".fa-sun");
    const moonIcon = document.querySelector(".fa-moon");

    const toggleDarkMode = (element) => {
        const checked = element.checked;

        sunIcon.style.display = checked ? "inline" : "none";
        moonIcon.style.display = checked ? "none" : "inline";

        const colorModeAttr = checked ? "dark" : "light";
        document.documentElement.setAttribute("color-mode", colorModeAttr);
        localStorage.setItem("color-mode", colorModeAttr);
    };

    // Check user preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const storedColorMode = localStorage.getItem("color-mode");
    const enableDarkMode = storedColorMode === "dark" || (prefersDarkMode.matches && !storedColorMode);

    toggleMode.checked = enableDarkMode;
    toggleDarkMode(toggleMode);

    // Enable dark mode button. This has been disabled by default incase, user has explicitly blocked javascript. 
    toggleLabel.style.display = "flex";

    // Add change event listener
    toggleMode.addEventListener('change', (e) => toggleDarkMode(e.currentTarget));
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