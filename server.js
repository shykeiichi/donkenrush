const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = 7000
const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    server.use('/api', createProxyMiddleware({ target: 'http://localhost:7000', ws: true }))

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})