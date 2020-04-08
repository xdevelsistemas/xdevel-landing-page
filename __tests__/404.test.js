const { timeout } = require('./test-utils')
const commonTests = require('./common-tests')

describe('404', () => {
  beforeAll(async () => {
    jest.setTimeout(100000)
  })
  beforeEach(async () => {
    await page.goto(`${PATH}/404.html`, { waitUntil: 'load' })
    await timeout(1000)
  })

  describe('common tests', commonTests)

  test('header', async () => {
    const header = await page.$('header.navigation')
    const brandLink = await header.$('.container .brand a')
    expect(await brandLink.evaluate(node => node.getAttribute('href'))).toBe('/')
  })

  test('content', async () => {
    const content = await page.$('.main-content .only-container')
    const img404 = await content.$('img')
    const paragraph = await content.$('p')
    const backLink = await content.$('a')

    expect(await img404.evaluate(node => node.getAttribute('src'))).toMatch('notfound.svg')
    expect(await paragraph.evaluate(node => node.textContent)).toBe('Página não encontrada!')
    expect(await backLink.evaluate(node => node.getAttribute('href'))).toBe('/')
  })
})
