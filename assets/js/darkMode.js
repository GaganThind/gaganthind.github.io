const DARKMODE = {
    
    init() {
        const modePreference = () => {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
            const colorModePrefereneSet = localStorage.getItem("color-mode");

            const userPrefersDarkMode = prefersDarkMode.matches && !colorModePrefereneSet;

            const enableDarkMode = (colorModePrefereneSet === "dark" || userPrefersDarkMode);
            document.querySelector('#toggleMode').checked = enableDarkMode;

            toggleDarkMode(document.querySelector('#toggleMode'));
        };

        const addEventToToggleModeCheckbox = () => {
            const toggleMode = document.querySelector('#toggleMode');
            toggleMode.addEventListener('change', (btn) => toggleDarkMode(btn.currentTarget));
        };

        const toggleDarkMode = (element) => {
            const checked = element.checked;
            const colorModeAttr = checked ? "dark" : "light";

            document.querySelector('.fa-sun').style.display = checked ? "inline" : "none";
            document.querySelector('.fa-moon').style.display = checked ? "none" : "inline";

            document.documentElement.setAttribute("color-mode", colorModeAttr);
            localStorage.setItem("color-mode", colorModeAttr);
        };

        // Enable dark mode button. This has been disabled by default incase,
        // user has explicitly blocked javascript. 
        document.querySelector('#toggleLabel').style.display = "inline";

        // Check if OS is using Dark or Light mode
        modePreference();

        // Add onClick event to toggle mode button
        addEventToToggleModeCheckbox();
    }
};

document.addEventListener('DOMContentLoaded', DARKMODE.init);