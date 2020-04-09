module.exports = () => {
  test('should be have a title and description', async () => {
    const title = await page.title()
    const description = await (await page.$('meta[name="description"]')).evaluate(node => node.getAttribute('content'))
    expect(title).toBe('xDevel Sistemas Escaláveis')
    expect(description).toBe('xDevel Sistemas Escaláveis - Traga sua ideia que a colocamos em prática!')
  })

  test('body without class loading', async () => {
    const body = await page.$('body')
    expect(await body.evaluate(node => node.classList.contains('loading'))).toBe(false)
  })

  test('loader has invisible', async () => {
    const loader = await page.$('#loader')
    expect(await loader.evaluate(node => node.getAttribute('style'))).toBe('display: none;')
  })

  test('header', async () => {
    const header = await page.$('header.navigation')
    const brandLink = await header.$('.container .brand a')
    const logo = await brandLink.$('img')
    expect(await brandLink.evaluate(node => node.getAttribute('aria-label'))).toBeDefined()
    expect(await logo.evaluate(node => node.getAttribute('src'))).toMatch('logo-white.png')
    expect(await logo.evaluate(node => node.getAttribute('alt'))).toMatch('xDevel')
  })

  test('footer', async () => {
    const footer = await page.$('footer')
    const paragraphs = await footer.$$('p')
    const brand = await paragraphs[0].evaluate(node => node.textContent.trim())
    expect(brand).toMatch('xDevel')
    const year = await (paragraphs[0]).evaluate(node => node.textContent.trim())
    expect(year).toMatch(`2012 - ${new Date().getFullYear()}`)
    const made = await paragraphs[2].evaluate(node => node.textContent)
    expect(made).toMatch('Made with')
    expect(made).toMatch('by xDevel')
  })
}
