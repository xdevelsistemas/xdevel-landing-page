const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV !== 'production'
const isTesting = NODE_ENV === 'test'
const isProd = NODE_ENV === 'production'

export { isDev, isProd, isTesting, NODE_ENV }
