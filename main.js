
window.onload = function() {
    
    // Check if OS is using Dark or Light mode
    modePreference();

    // Add onClick event to toggle mode button
    addClickToToggleModeBtn();
}

const modePreference = function() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const colorMode = localStorage.getItem("color-mode");
    if ( colorMode === "dark" ||
        (prefersDarkScheme.matches
        && !colorMode)) {
        document.documentElement.setAttribute("color-mode", "dark");
    }
}

const addClickToToggleModeBtn = function() {
    const toggleBtn = document.querySelectorAll('.toggleBtn');
    toggleBtn.forEach((btn) => btn.addEventListener('click', toggleMode));
}

const toggleMode = function(e) {
    const element = document.documentElement;
    if (e.currentTarget.classList.contains("dark")) {
        element.setAttribute("color-mode", "light");
        localStorage.setItem("color-mode", "light");
    } else {
        element.setAttribute("color-mode", "dark");
        localStorage.setItem("color-mode", "dark");
    }

}

