/**
 * Create a element alert and append in element
 * @param {Window} window Window DOM instance
 * @returns {(message: string, appendTo: HTMLElement, type?: 'default' | 'success' | 'error', id?: string, temporary?: boolean, timeout?: number) => HTMLElement}
 */
export const createAlertFactory = window => (message, appendTo, type = 'default', id = `alert_${Math.round(Math.random() * 1024)}`, temporary = false, timeout = 10) => {
  const alertElement = window.document.createElement('div')
  const messageElement = window.document.createElement('p')
  const close = window.document.createElement('span')
  alertElement.id = id
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

  if (temporary) {
    setTimeout(() => {
      if (!alertElement.classList.contains('fade-out')) {
        close.click()
      }
    }, timeout * 1000)
  }

  return alertElement
}

/**
 * All types of alert
 * @enum EAlertTypes
 */
export const EAlertTypes = {
  default: 'default',
  success: 'success',
  error: 'error'
}
