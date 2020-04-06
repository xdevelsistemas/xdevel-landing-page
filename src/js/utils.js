export const scrollTo = (to, duration) => {
  const element = document.scrollingElement || document.documentElement
  const start = element.scrollTop
  const change = to - start
  const startDate = +new Date()

  /**
   *
   * @param {number} currentTime current time
   * @param {number} start start value
   * @param {number} change change in value
   * @param {number} duration duration in ms
   */
  const easeInOutQuad = (currentTime, start, change, duration) => {
    currentTime /= duration / 2
    if (currentTime < 1) return (change / 2) * currentTime * currentTime + start
    currentTime--
    return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start
  }

  const animateScroll = () => {
    const currentDate = +new Date()
    const currentTime = currentDate - startDate
    element.scrollTop = parseInt(
      easeInOutQuad(currentTime, start, change, duration)
    )
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      element.scrollTop = to
    }
  }
  animateScroll()
}

export const isOnScreen = el => {
  const headerSize = 100
  const scroll = window.scrollY || window.pageYOffset
  const boundsTop = el.getBoundingClientRect().top + scroll

  const viewport = {
    top: scroll + headerSize,
    bottom: scroll + window.innerHeight
  }

  const bounds = {
    top: boundsTop + headerSize,
    bottom: boundsTop + el.clientHeight
  }

  return (
    (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) ||
    (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
  )
}

export const counter = show => {
  const getFormatedNumber = n => {
    const number = window.Intl.NumberFormat('pt-Br', {
      style: 'decimal',
      maximumSignificantDigits: 4
    }).format(n)

    return number.replace('.000', '').replace(/([0-9]+)(\.[0-9]+)/, '$1')
  }

  const counterBeforeThousands = () => {
    if (counter > 999) {
      return counterAfterThousands()
    }
    y++
    delay = x - y
    show.innerHTML = `${counter} +`
    counter += counter >= 300 ? 50 : 1
    if (counter < number) {
      setTimeout(() => counterBeforeThousands(), delay)
    }
  }

  const counterAfterThousands = () => {
    delay = 80 / counter
    show.innerHTML = `${getFormatedNumber(counter)}K +`
    counter += counter >= 10000 ? 1000 : 100
    if (counter < number) {
      setTimeout(() => counterAfterThousands(), delay)
    }
  }

  const number = Number(show.innerHTML) + 1

  let counter = 0
  let delay = 1
  const x =
    number > 10000
      ? Math.min(number / 10000 / 2, 200)
      : Math.min(number / 1000, 200)
  let y = 0

  counterBeforeThousands()
}
