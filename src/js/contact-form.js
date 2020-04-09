import FormValidator from '@yaireo/validator'
import { createAlertFactory } from './alert'

const createAlert = createAlertFactory(window)
const form = window.document.querySelector('section#contact form')

const validator = new FormValidator(
  {
    texts: {
      empty: 'Campo obrigatório!',
      email: 'E-mail inválido!',
      complete: 'É preciso escrever um pouco mais!'
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
  const url = process.env.NODE_ENV === 'test' ? '/contact-submit' : 'https://formspree.io/xrgakypw'
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
      button.classList.add('disabled')
      window.document.getElementById('loader').style.display = ''
      window.document.body.classList.add('loading')
      try {
        await request(new FormData(form))
        const message = 'Obrigado por entrar em contato! Em breve enviaremos um retorno.'
        createAlert(message, messagesContainer, 'success')
        form.reset()
      } catch (e) {
        const message = 'Erro inesperado ao enviar, por favor entre em contato por email ou tente novamente mais tarde.'
        createAlert(message, messagesContainer, 'error')
      } finally {
        isLoading = false
        button.classList.remove('disabled')
        window.document.getElementById('loader').style.display = 'none'
        window.document.body.classList.remove('loading')
      }
    })
  }
}
