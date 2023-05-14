const fs = require('fs')

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
    if(patreonRewardName){
        content.push(`${patreonUserName} (${patreonRewardName})`)
    }
    content = content.join('\n')
    fs.writeFileSync(path, content)
}

module.exports = {
    updateListFile
}