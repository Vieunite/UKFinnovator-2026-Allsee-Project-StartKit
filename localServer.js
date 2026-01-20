const express = require('express')
const next = require('next')
const https = require('https')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3000

app.prepare().then(() => {
  const server = express()

  server.use(express.json())
  server.use(cookieParser())

  // CORS for secure cross-origin requests
  server.use(
    cors({
      origin: 'https://192.168.1.140', // Your backend
      credentials: true,
    })
  )

  // HTTPS setup
  const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
  }

  const httpsServer = https.createServer(options, server)

  // Handle all Next.js requests
  server.all('*', (req, res) => handle(req, res))

  httpsServer.listen(PORT, () => {
    //removedconsole.log(`🚀 Secure Next.js running on https://localhost:${PORT}`)
  })
})
