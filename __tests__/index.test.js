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

  describe('header', () => {
    test('menu click', async () => {
      const header = await page.$('header.navigation')
      const navList = await header.$$('li a')
      const menus = ['quem somos', 'por que nos escolher?', 'contato']

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
    test('brand click', async () => {
      const header = await page.$('header.navigation')
      const brandLink = await header.$('.container .brand a')

      expect(await brandLink.evaluate(node => node.getAttribute('href'))).toBe('#')
      brandLink.click()
      await timeout(400)
      await Promise.all((await header.$$('li a')).map(async nav => {
        expect(await nav.evaluate(node => node.classList.contains('active'))).toBe(false)
      }))
    })
  })

  describe('home section', () => {
    test('should be defined title and counters', async () => {
      const home = await page.$('#home')
      const title = await (await home.$('h2')).evaluate(node => node.textContent)
      const counters = await home.$$('.count')
      expect(title.toLowerCase()).toBe('sobre nós')
      expect(counters).toHaveLength(4)
    })

    test('should be count number defined', async () => {
      const home = await page.$('#home')
      const counters = await home.$$('.count')
      // it is necessary to wait for the animation of the counter
      await timeout(2000)
      for (const counter of counters) {
        const countNumber = await counter.$('p.counter')
        expect(await countNumber.evaluate(node => node.textContent)).toMatch(/[0-9]+(K\s|)\+/i)
      }
    })
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

  describe('contact section', () => {
    test('should be title defined', async () => {
      const contact = await page.$('section#contact')
      const title = await (await contact.$('h2')).evaluate(node => node.textContent)
      expect(title.toLowerCase()).toBe('contato')
    })

    test('should be error alerts on input dirty', async () => {
      const contact = await page.$('section#contact')
      const form = await contact.$('form')
      const name = await form.$('input[name="name"]')
      const email = await form.$('input[name="email"]')
      const message = await form.$('textarea[name="message"]')

      await name.focus()
      await email.focus()
      await message.focus()

      const alerts = await form.$$('.group.field.bad .alert')
      for (const alert of alerts) {
        expect(await alert.evaluate(node => node.textContent.toLowerCase())).toBe('campo obrigatório!')
      }
    })

    test('should be email validation', async () => {
      const contact = await page.$('section#contact')
      const form = await contact.$('form')
      const getFirstAlert = async () => await form.$('.group.field.bad .alert')
      const name = await form.$('input[name="name"]')
      const email = await form.$('input[name="email"]')
      const message = await form.$('textarea[name="message"]')
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
    })

    test('should be message validation', async () => {
      const contact = await page.$('section#contact')
      const form = await contact.$('form')
      const getFirstAlert = async () => await form.$('.group.field.bad .alert')
      const message = await form.$('textarea[name="message"]')
      const messageAlert = await getFirstAlert()
      const messageAlertText = 'é preciso escrever um pouco mais!'

      expect(await messageAlert.evaluate(node => node.textContent.toLowerCase())).toBe(messageAlertText)
      const phrase = faker.hacker.phrase()
      await message.evaluate(node => { node.value = '' })
      await message.type(phrase, { delay: 10 })
      await timeout(200)
      expect(await getFirstAlert()).toBeNull()
    })

    test('should be success submit form', async () => {
      const contact = await page.$('section#contact')
      const form = await contact.$('form')
      const sendButton = await form.$('button[type="submit"]')

      await sendButton.click({ delay: 100 })
      await timeout(800)
      const messageSuccess = await form.$('.messages .alert-box p')
      expect(await messageSuccess.evaluate(node => node.textContent)).toBe('Obrigado por entrar em contato! Em breve enviaremos um retorno.')
    })

    test('should be social media and email defined', async () => {
      const contact = await page.$('section#contact')
      const socialMedias = ['twitter', 'instagram', 'github', 'facebook']
      const socialMediaLinks = await contact.$$('.social-medias a')
      const email = await contact.$('.email p a')

      for (const link of socialMediaLinks) {
        const href = (await link.evaluate(node => node.getAttribute('href')))
        const media = href.replace(/http(s|):\/\/(www\.|)(.+)\..*/i, '$3')
        expect(socialMedias).toContain(media)
      }

      const expectedEmail = 'contato@xdevel.com.br'
      expect(await email.evaluate(node => node.textContent)).toBe(expectedEmail)
      expect(await email.evaluate(node => node.getAttribute('href'))).toBe(`mailto:${expectedEmail}`)
    })
  })
})
