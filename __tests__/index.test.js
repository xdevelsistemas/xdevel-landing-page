const faker = require('faker')
const { timeout } = require('./test-utils')
const commonTests = require('./common-tests')

faker.locale = 'pt_BR'

describe('Index', () => {
  beforeAll(async () => {
    jest.setTimeout(100000)
    await page.goto(PATH, { waitUntil: 'load' })
    await timeout(1000)
  })

  describe('common tests', commonTests)

  test('header', async () => {
    const header = await page.$('header.navigation')
    const navList = await header.$$('li a')
    const menus = ['quem somos', 'por que nos escolher?', 'contato']
    const brandLink = await header.$('.container .brand a')

    expect(await brandLink.evaluate(node => node.getAttribute('href'))).toBe('#')
    brandLink.click()
    await timeout(400)
    await Promise.all((await header.$$('li a')).map(async nav => {
      expect(await nav.evaluate(node => node.classList.contains('active'))).toBe(false)
    }))

    for (const nav of navList) {
      // should be not active menu
      expect(await nav.evaluate(node => node.classList.contains('active'))).toBe(false)
      expect(menus.indexOf(await nav.evaluate(node => node.textContent.toLowerCase()))).not.toBe(-1)
      await nav.click()
      // it is necessary to wait for the animation
      await timeout(450)
      expect(await nav.evaluate(node => node.classList.contains('active'))).toBe(true)
    }
  })

  test('home section', async () => {
    const home = await page.$('#home')
    const title = await (await home.$('h2')).evaluate(node => node.textContent)
    const counters = await home.$$('.count')
    expect(title.toLowerCase()).toBe('sobre nós')
    expect(counters).toHaveLength(4)

    // it is necessary to wait for the animation of the counter
    await timeout(2000)

    for (const counter of counters) {
      const countNumber = await counter.$('p.counter')
      expect(await countNumber.evaluate(node => node.textContent)).toMatch(/[0-9]+K +/i)
    }
  })

  test('about section', async () => {
    const about = await page.$('section#about')
    const title = await (await about.$('h2')).evaluate(node => node.textContent)
    expect(title.toLowerCase()).toBe('quem somos')
  })

  test('reasons section', async () => {
    const reasons = await page.$('section#reasons')
    const title = await (await reasons.$('h2')).evaluate(node => node.textContent)
    expect(title.toLowerCase()).toBe('por que nos escolher?')
  })

  test('contact section', async () => {
    const contact = await page.$('section#contact')
    const title = await (await contact.$('h2')).evaluate(node => node.textContent)
    expect(title.toLowerCase()).toBe('contato')

    const form = await contact.$('form')
    const getFirstAlert = async () => await form.$('.group.field.bad .alert')
    const name = await form.$('input[name="name"]')
    const email = await form.$('input[name="email"]')
    const message = await form.$('textarea[name="message"]')
    const sendButton = await form.$('button[type="submit"]')
    await name.focus()
    await email.focus()
    await message.focus()
    await sendButton.focus()

    const alerts = await form.$$('.group.field.bad .alert')
    for (const alert of alerts) {
      expect(await alert.evaluate(node => node.textContent.toLowerCase())).toBe('campo obrigatório!')
    }

    await name.type(faker.name.firstName(), { delay: 100 })
    await email.type(faker.name.lastName(), { delay: 100 })
    await message.type(faker.name.jobDescriptor(), { delay: 100 })

    const emailAlert = await getFirstAlert()
    expect(await emailAlert.evaluate(node => node.textContent.toLowerCase())).toBe('e-mail inválido!') // é preciso escrever um pouco mais!
    const emailFaker = faker.internet.email()
    await email.evaluate(node => { node.value = '' })
    await email.type(emailFaker, { delay: 50 })
    await timeout(200)
    expect(await (await getFirstAlert()).evaluate(node => node.textContent.toLowerCase())).not.toBe('e-mail inválido!')

    const messageAlert = await getFirstAlert()
    const messageAlertText = 'é preciso escrever um pouco mais!'
    expect(await messageAlert.evaluate(node => node.textContent.toLowerCase())).toBe(messageAlertText)
    const phrase = faker.hacker.phrase()
    await message.evaluate(node => { node.value = '' })
    await message.type(phrase, { delay: 10 })
    await timeout(200)
    expect(await getFirstAlert()).toBeNull()

    const socialMedias = ['twitter', 'instagram', 'github', 'facebook']
    const socialMediaLinks = await contact.$$('.social-medias a')
    for (const link of socialMediaLinks) {
      const href = (await link.evaluate(node => node.getAttribute('href')))
      const media = href.replace(/http(s|):\/\/(www\.|)(.+)\..*/i, '$3')
      expect(socialMedias).toContain(media)
    }
  })
})
