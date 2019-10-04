const express = require('express')
let app = express()
const bodyParser = require('body-parser')
const consign = require('consign-ignore')
const http = require('http').Server(app)
const path = require('path')

app.mongoose = require('mongoose')
app.rp = require('request-promise')

require('dotenv').config()

// BODY JSON
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// ASSETS
app.use(express.static(path.join(__dirname, 'app/assets')))

// ENGINE LAYOUT
app.set('views', './app/views')
app.set('view engine', 'ejs')

// REQUESTS LOG
app.use((req, res, next) => {
  let body = req.body || {}
  let params = req.params || {}
  let query = req.query || {}
  console.debug(`${req.method}|${req.url}|`, {
    ...body,
    ...params,
    ...query
  })
  next()
})

consign({ cwd: 'app', extensions: ['\\.js', '.json'], ignore: ['assets'] })
  .include('controllers')
  .then('models/_db.js')
  .then('models')
  .then('routes')
  .into(app)

// workaround pois o parametro de cwd do consign não funcionou
// app = { ...app, ...app.app }

// CATCH 404 AND FORWARD TO ERROR HANDLER
app.use((req, res, next) => {
  console.error({ ul: req.url, method: req.method, body: req.body }, 404)

  res.status(404).send('<h1>Página não encontrada<h1>')
})

http.listen(process.env.PORT, async () => {
  console.debug(`\n****************************** |\t\tRODANDO NA PORTA : ${process.env.PORT}\t\t| ******************************`)
})

// EXPORTS:
module.exports = app
