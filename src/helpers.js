const crypto = require('crypto')
const fs = require('fs')

function parsePayload(payload){
    const { data, included } = payload
    const { relationships } = data
    const { campaign , patron, reward } = relationships

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

function verifySignature(req, secret){
    const contentHash = crypto.createHmac('md5', secret)
    .update(req.body)
    .digest('hex');

  if(contentHash !== req.headers['x-patreon-signature']){
    throw new Error('Signature mismatch')
  }
}

/**
 * Every new call will first remove the entry
 * then readd it if patreonRewardName is defined
 * keep patreonRewardName null to remove the entry
 * 
 * Format is the following:
 * PatreonUsername: (RewardName)
 */
function updateListFile(patreonUserName, patreonRewardName, path){
    if(!patreonUserName)
        throw new Error('patreonUserName is required')
    
    let content = fs.readFileSync(path, 'utf8')
    content = content.split('\n')

    content = content.filter((item) => item && !item.startsWith(patreonUserName))
    console.log("content", content)
    if(patreonRewardName){
        content.push(`${patreonUserName} (${patreonRewardName})`)
    }
    content = content.join('\n')
    fs.writeFileSync(path, content)
}

module.exports = {
    parsePayload,
    verifySignature,
    updateListFile
}