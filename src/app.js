import { setupContactForm } from './js/contact-form'
import { setupNavbar } from './js/navbar'
import { counterFactory } from './js/utils'
import './styles/app.scss'

const counter = counterFactory(window)

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

  if (process.env.NODE_ENV === 'production') {
    setTimeout(console.log.bind(console, '%cxDevel', 'font-family: Roboto, sans-serif;color: #2ca242ff;font-size: 5rem;'), 0)
    setTimeout(console.log.bind(console, '%cÉ um prazer tê-lo(a) conosco!', 'font-family: Roboto, sans-serif;color: #3bb273;font-size: 1.2rem;'), 20)
  }
})
