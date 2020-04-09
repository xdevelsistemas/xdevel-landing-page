import FormValidator from '@yaireo/validator'
import { createAlertFactory, EAlertTypes } from './alert'
import { isTesting } from './config'
import constants from './constants'

const createAlert = createAlertFactory(window)
const form = window.document.querySelector('section#contact form')

const validator = new FormValidator(
  {
    texts: {
      empty: constants.formValidations.required,
      email: constants.formValidations.email,
      complete: constants.formValidations.complete
    },
    events: ['blur', 'input', 'change']
  },
  form
)

/**
 * HTTP Request contact form
 * @param {FormData} data form data instance to send in POST
 * @returns {Promise<void>}
 */
const request = data => new Promise((resolve, reject) => {
  const url = isTesting ? constants.apiUrl.test : constants.apiUrl.default
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.onreadystatechange = () => {
    try {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return
      }
      if (xhr.status === 200) {
        return resolve()
      }
      return reject(Object.assign(new Error(), { status: xhr.status, res: xhr.response }))
    } catch (e) {
      return reject(e)
    }
  }
  xhr.send(data)
})

let isLoading = false
export const setupContactForm = () => {
  if (form) {
    const messagesContainer = form.querySelector('.messages')
    const button = form.querySelector('button[type="submit"]')
    form.addEventListener('submit', async e => {
      e.preventDefault()
      if (isLoading) { return }
      messagesContainer.innerHTML = ''
      const { valid } = validator.checkAll(form)
      if (!valid) {
        return
      }
      isLoading = true
      button.classList.add(constants.classes.disabled)
      window.document.getElementById(constants.elementIds.loader).style.display = ''
      window.document.body.classList.add(constants.classes.loading)
      try {
        await request(new FormData(form))
        const message = constants.messages.successContact
        createAlert(message, messagesContainer, EAlertTypes.success)
        form.reset()
      } catch (e) {
        const message = constants.messages.errorContact
        createAlert(message, messagesContainer, EAlertTypes.error)
      } finally {
        isLoading = false
        button.classList.remove(constants.classes.disabled)
        window.document.getElementById(constants.elementIds.loader).style.display = 'none'
        window.document.body.classList.remove(constants.classes.loading)
      }
    })
  }
}
