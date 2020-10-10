if (failedSetupAttempts > 100) {
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
            title: 'Something went wrong! X_X',
            message: 'YouTube uninterrupted couldn\'t initialize correctly.\nTry reloading the page.',
            iconUrl: '',
            type: 'basic'
        }
    });
} else {
    failedSetupAttempts++;
}


var failedSetupAttempts = 0;