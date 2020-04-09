module.exports = {
  server: {
    command: 'yarn test:server',
    port: 4444
  },
  launch: {
    headless: process.env.HEADLESS !== 'false',
    devtools: process.env.DEVTOOLS !== 'false',
    defaultViewport: {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    },
    args: ['--start-maximized']
  }
}
