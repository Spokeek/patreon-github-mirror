const { parsePayload, updateListFile } = require('./helpers.js')

const listFileDir = require('path').resolve(__dirname, '../data/')

function onPledgeCreate(payload){
    const eventData = parsePayload(payload)
    updateListFile(
        eventData.patreonUserName,
        eventData.patreonRewardName,
        require('path').resolve(listFileDir, `${eventData.patreonCampainName}.txt`)
    )
}

function onPledgeUpdate(){
    const eventData = parsePayload(payload)
    updateListFile(
        eventData.patreonUserName,
        eventData.patreonRewardName,
        require('path').resolve(listFileDir, `${eventData.patreonCampainName}.txt`)
    )
}

function onPledgeDelete(){
    const eventData = parsePayload(payload)
    updateListFile(
        eventData.patreonUserName,
        null,
        require('path').resolve(listFileDir, `${eventData.patreonCampainName}.txt`)
    )
}

module.exports = {
    onPledgeCreate,
    onPledgeUpdate,
    onPledgeDelete,
}
