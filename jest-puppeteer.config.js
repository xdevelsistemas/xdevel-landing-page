module.exports = {
  server: {
    command: 'yarn test:server',
    port: 4444
  },
  launch: {
    headless: process.env.HEADLESS !== 'false'
  }
}
