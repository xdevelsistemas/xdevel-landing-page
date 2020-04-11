import constants from './constants'
import { isOnScreenFactory, scrollToFactory } from './utils'

const isOnScreen = isOnScreenFactory(window)
const scrollTo = scrollToFactory(window)

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
      toggle.classList.toggle(constants.classes.active)
      window.document.querySelector('nav ul').classList.toggle(constants.classes.active)
    })
  }

  /**
   * For each <a> in list add event click to active
   */
  linksNavList.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()

      toggle.classList.remove(constants.classes.active)
      window.document.querySelector('nav ul').classList.remove(constants.classes.active)

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
  const setTabActive = () => {
    sections.some(section => {
      const isActive = isOnScreen(section)
      if (isActive) {
        const currentLink = header.querySelector(`nav ul.nav-list li a.${constants.classes.active}`)
        const nextLink = header.querySelector(
          `nav ul.nav-list li a[href="#${section.id}"]`
        )
        if (currentLink) {
          currentLink.classList.remove(constants.classes.active)
        }
        if (nextLink) {
          nextLink.classList.add(constants.classes.active)
        }
      }
      return isActive
    })
  }
  window.document.addEventListener('scroll', () => raf(setTabActive))
  setTabActive()

  const validIds = [...window.document.querySelectorAll('section')]
    .map(section => section.getAttribute('id'))
    .filter(id => id.length > 0)
  const atualHash = window.location.hash.replace('#', '')
  if (atualHash && validIds.indexOf(atualHash) !== -1) {
    const target = window.document.getElementById(atualHash).offsetTop - 70
    scrollTo(target, 400)
  }
}
