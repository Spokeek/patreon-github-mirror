const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }))
const crypto = require('crypto')
const hooks = require('./patreonHooks')

const secret = process.env.PATREON_SECRET;
if(!secret){
  console.warn("DANGER, no secret defined, there will be no signature check!")
}

app.use(bodyParser.json())
app.post('/patreon-hook', (req, res) => {
  const signature = req.headers['x-patreon-signature']

  if(secret){
    const contentHash = crypto.createHmac('md5', secret)
      .update(req.body)
      .digest('hex');

    if(contentHash !== signature){
      res.sendStatus(403, 'Signature mismatch')
      return
    }
  }
    
  const event = req.headers['x-patreon-event']
  
  switch(event){
    case "pledges:create":
      hooks.onPledgeCreate(req.body)
      break
    case "pledges:update":
      hooks.onPledgeUpdate(req.body)
      break
    case "pledges:delete":
      hooks.onPledgeDelete(req.body)
      break
    default:
      res.sendStatus(400, 'Unknown hook type / Unhandled hook type')
      return
  }
  res.send('Patron hook received!')
})

app.listen(port, () => {
  console.log(`App app listening on port ${port}`)
})