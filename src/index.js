const logger = require('./logger')
const config = require('./config')
const patreonHooks = require('./patreon-hooks')

const express = require('express')
var bodyParser = require('body-parser')
const { expressErrorHandler, HTTPError } = require('./errors')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post(patreonHooks.ROUTE, (req, res) => {
  const signature = req.headers[patreonHooks.SIGNATURE_HEADER]
  const event = req.headers[patreonHooks.EVENT_HEADER]

  patreonHooks.handlePatronHook(signature, event, req.body)

  res.send('Patreon hook processed')
  }
)

app.use(expressErrorHandler)


app.listen(config.get('application.port'), () => {
  logger.info(`App app listening on port ${config.get('application.port')}`)
})

