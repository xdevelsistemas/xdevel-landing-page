export default {
  brand: 'xDevel',
  messages: {
    welcome: 'É um prazer tê-lo(a) conosco!',
    successContact: 'Obrigado por entrar em contato! Em breve enviaremos um retorno.',
    errorContact: 'Erro inesperado ao enviar, por favor entre em contato por email ou tente novamente mais tarde.'
  },
  apiUrl: {
    default: 'https://formspree.io/xrgakypw',
    test: '/contact-submit'
  },
  formValidations: {
    required: 'Campo obrigatório!',
    email: 'E-mail inválido!',
    complete: 'É preciso escrever um pouco mais!'
  },
  classes: {
    loading: 'loading',
    disabled: 'disabled',
    success: 'success',
    error: 'error',
    active: 'active'
  },
  elementIds: {
    loader: 'loader'
  }
}
