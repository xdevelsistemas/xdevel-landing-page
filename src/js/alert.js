/**
 * Create a element alert and append in element
 * @param {Window} window Window DOM instance
 * @returns {(message: string, appendTo: HTMLElement, type?: 'default' | 'success' | 'error', id?: string) => HTMLElement}
 */
export const createAlertFactory = window => (message, appendTo, type = 'default', id = `alert_${Math.round(Math.random() * 1024)}`, temporary = true) => {
  const alertElement = window.document.createElement('div')
  const messageElement = window.document.createElement('p')
  const close = window.document.createElement('span')
  alertElement.classList.add('alert-box', type, 'fade-in')
  close.classList.add('close-button')
  messageElement.innerText = message
  alertElement.appendChild(messageElement)
  alertElement.appendChild(close)

  appendTo.appendChild(alertElement)

  close.addEventListener('click', e => {
    e.preventDefault()
    alertElement.classList.add('fade-out')
  })

  alertElement.addEventListener('animationend', e => {
    if (e.animationName === 'fadeOut') {
      appendTo.removeChild(alertElement)
    }
  })

  return alertElement
}
