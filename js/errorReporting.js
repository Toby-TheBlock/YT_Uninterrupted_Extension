

function reportError() {
    let occurredErrors = parseInt(localStorage.getItem("occurredErrors")) + 1;
    localStorage.setItem("occurredErrors", occurredErrors.toString());
}

function errorManagement() {
    let errorCount = "0";

    if (!checkURLForChange) {
        if (parseInt(localStorage.getItem("occurredErrors")) > 10) {
            createChromeMSGBox();
        }
    } else {
        localStorage.setItem("occurredErrors", errorCount);
    }
}

function createChromeMSGBox() {
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
            title: 'Something went wrong! X_X',
            message: 'YouTube uninterrupted couldn\'t initialize correctly.\nTry reloading the page.',
            iconUrl: '',
            type: 'basic'
        }
    });
}