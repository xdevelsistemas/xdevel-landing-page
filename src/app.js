import 'core-js/features/array/for-each'
import 'core-js/features/array/some'
import { setupContactForm } from './js/contact-form'
import { setupNavbar } from './js/navbar'
import { counter } from './js/utils'
import './styles/app.scss'

const removeLoading = () => {
  window.document.getElementById('loader').style.display = 'none'
  window.document.body.classList.remove('loading')
}

window.addEventListener('load', () => {
  setupNavbar()
  setupContactForm()

  const yearElement = window.document.getElementById('year')
  yearElement.innerHTML = yearElement.innerHTML.replace(
    '{now}',
    new Date().getFullYear().toString()
  )

  removeLoading()

  window.document
    .querySelectorAll('.count p.counter')
    .forEach(count => counter(count))
})
