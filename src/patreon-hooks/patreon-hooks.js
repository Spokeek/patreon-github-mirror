const config = require('../config')
const crypto = require('crypto')
const { HTTPError } = require('../errors')
const { updateListFile } = require('../file-edition')


function _parsePayload(payload) {
  const { data, included } = payload
  const { relationships } = data
  const { campaign, patron, reward } = relationships

  const patreonCampainId = campaign.data.id;
  const patreonCampainName = included.find((item) =>
    item.type === "campaign" &&
    item.id === patreonCampainId
  ).attributes.name

  const patreonUserId = patron.data.id;
  const patreonUser = included.find((item) =>
    item.type === "user" &&
    item.id === patreonUserId
  )
  const patreonUserName = patreonUser.attributes.full_name

  const patreonRewardId = reward.data.id;
  const patreonRewardName = included.find((item) =>
    item.type === "reward" &&
    item.id === patreonRewardId
  ).attributes.title

  return {
    patreonCampainId,
    patreonCampainName,

    patreonRewardId,
    patreonRewardName,

    patreonUserId,
    patreonUserName
  }
}

function handlePatronHook(signature, event, payload) {
  const PATREON_SECRET = config.get('patreon.secret')

  if (PATREON_SECRET) {
    const contentHash = crypto.createHmac('md5', PATREON_SECRET)
      .update(payload)
      .digest('hex');

    if (contentHash !== signature) {
      throw new HTTPError('Signature mismatch', 401)
    }
  }

  const {
    patreonUserName,
    patreonRewardName,
    patreonCampainName,
  } = _parsePayload(payload)

  switch (event) {
    case "pledges:create":
    case "pledges:update":
      updateListFile(
        patreonUserName,
        patreonRewardName,
        patreonCampainName
      )
      break
    case "pledges:delete":
      updateListFile(
        patreonUserName,
        null,
        patreonCampainName
      )
    default:
      throw new HTTPError('Unknown hook type / Unhandled hook event', 400)
  }
}

const ROUTE = '/patreon-hook'
const METHOD = 'POST'
const SIGNATURE_HEADER = 'x-patreon-signature'
const EVENT_HEADER = 'x-patreon-event'

module.exports = {
  ROUTE,
  METHOD,
  SIGNATURE_HEADER,
  EVENT_HEADER,
  handlePatronHook,
  _parsePayload
}