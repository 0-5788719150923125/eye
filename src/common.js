export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export function randomString(
    len = 3,
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
) {
    let text = ''
    for (let i = 0; i < len; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return text
}

export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Function to send data to the popup
export function sendToForeground(action, data) {
    chrome.runtime.sendMessage({ action, data })
}

export function eventHandler(event, gun = null) {
    if (event.data.action === 'classification') {
        sendToForeground('toTopic', event.data.answer)
    } else if (event.data.status === 'partial') {
        sendToForeground('floatRight')
        sendToForeground('toInputField', event.data.input + '//:fold')
    } else if (event.data.status === 'complete') {
        if (event.data.output.length > 2) {
            console.log(event.data.output)
            sendToForeground('toOutputField', event.data.output)
            if (gun) gun.send(event.data.output)
        }
        sendToForeground('toInputField', '')
        sendToForeground('floatLeft')
    } else if (
        !['progress', 'ready', 'done', 'download', 'initiate'].includes(
            event.data.status
        )
    ) {
        console.log(event)
    } else {
        sendToForeground('toInputField', '')
        sendToForeground('floatLeft')
    }
}