import FormValidator from '@yaireo/validator'

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

export const setupContactForm = () => {
  if (form) {
    form.addEventListener('submit', e => {
      const { valid } = validator.checkAll(form)
      if (!valid) {
        e.preventDefault()
      }
    })
  }
}
