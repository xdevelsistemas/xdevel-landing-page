import { isOnScreen, scrollTo } from './utils'

// requestAnimationFrame
const raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60)
  }

export const setupNavbar = () => {
  // HEADER
  const header = window.document.querySelector('header.navigation')
  // MOBILE TOGGLE MENU
  const toggle = header.querySelector('.container nav .nav-mobile a#nav-toggle')
  // All <a> links in menu
  const linksNavList = header.querySelectorAll('nav ul.nav-list li a')

  /**
   * On click event in mobile toggle menu
   */
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active')
      window.document.querySelector('nav ul').classList.toggle('active')
    })
  }

  /**
   * For each <a> in list add event click to active
   */
  linksNavList.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()

      toggle.classList.remove('active')
      window.document.querySelector('nav ul').classList.remove('active')

      const targetId = e.target.getAttribute('href').substr(1)
      const to = window.document.getElementById(targetId).offsetTop - 70
      scrollTo(to, 400)
      window.location.hash = targetId
    })
  })

  header.querySelector('.brand a').addEventListener('click', e => {
    const is404 = /404\.html/.test(window.location.pathname)
    if (is404) {
      return
    }
    e.preventDefault()
    scrollTo(0, 400)
    window.location.hash = ''
  })

  const sections = [...window.document.querySelectorAll('section')]
  window.document.addEventListener('scroll', () =>
    raf(() => {
      sections.some(section => {
        const isActive = isOnScreen(section)
        if (isActive) {
          const currentLink = header.querySelector(
            'nav ul.nav-list li a.active'
          )
          const nextLink = header.querySelector(
            `nav ul.nav-list li a[href="#${section.id}"]`
          )
          if (currentLink) {
            currentLink.classList.remove('active')
          }
          if (nextLink) {
            nextLink.classList.add('active')
          }
        }
        return isActive
      })
    })
  )
}
