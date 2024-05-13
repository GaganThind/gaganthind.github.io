
window.onload = function() {

    // Check if OS is using Dark or Light mode
    modePreference();

    // Add onClick event to toggle mode button
    addClickToToggleModeBtn();
}

const modePreference = function() {
    const colorMode = localStorage.getItem("color-mode");
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Default to White mode
    let darkBtnDisplay = "none";
    let lightBtnDisplay = "flex";
    let colorModeAttr = "light";

    const darkModeCheck = prefersDarkScheme.matches && !colorMode;

    // DarkMode
    if (colorMode === "dark" || darkModeCheck) {
        darkBtnDisplay = "flex";
        lightBtnDisplay = "none";
        colorModeAttr = "dark";
    }

    document.getElementById('darkBtn').style.display = darkBtnDisplay;
    document.getElementById('lightBtn').style.display = lightBtnDisplay;
    document.documentElement.setAttribute("color-mode", colorModeAttr);
}

const addClickToToggleModeBtn = function() {
    const toggleBtn = document.querySelectorAll('.toggleBtn');
    toggleBtn.forEach((btn) => btn.addEventListener('click', toggleMode));
}

const toggleMode = function(btn) {
    const element = document.documentElement;

    // Default to White mode
    let darkBtnDisplay = "none";
    let lightBtnDisplay = "flex";
    let colorModeAttr = "light";

    // DarkMode
    if (btn.currentTarget.classList.contains("light")) {
        darkBtnDisplay = "flex";
        lightBtnDisplay = "none";
        colorModeAttr = "dark";
    }

    element.setAttribute("color-mode", colorModeAttr);
    localStorage.setItem("color-mode", colorModeAttr);
    document.getElementById('darkBtn').style.display = darkBtnDisplay;
    document.getElementById('lightBtn').style.display = lightBtnDisplay;
}

