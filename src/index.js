const express = require('express')
const app = express()
const port = 3000

app.get('/patreon-hook', (req, res) => {
  console.log({
    query: req.query,
    headers: req.headers
  })
  res.send('Patron hook received!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})