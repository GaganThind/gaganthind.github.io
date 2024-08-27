const APP = {
    init() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/serviceWorker.js');
        } else {
            console.warn('Service workers are not supported.');
        }
    }
};

document.addEventListener('DOMContentLoaded', APP.init);