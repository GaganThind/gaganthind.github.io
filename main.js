
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

const toggleMode = function(btn) {
    const element = document.documentElement;
    if (btn.currentTarget.classList.contains("dark")) {
        element.setAttribute("color-mode", "light");
        localStorage.setItem("color-mode", "light");
        document.getElementById('darkBtn').style.display="none";
        document.getElementById('lightBtn').style.display="flex";
    } else {
        element.setAttribute("color-mode", "dark");
        localStorage.setItem("color-mode", "dark");
        document.getElementById('darkBtn').style.display="flex";
        document.getElementById('lightBtn').style.display="none";
    }
}

