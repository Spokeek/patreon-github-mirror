const {updateListFile, parsePayload} = require('./helpers.js')
const fs = require('fs')

test('Testing payload parse', () => {
    const data = require('./_mocks/data.json')
    const result = parsePayload(data)
    expect(result.patreonCampainId).toBe("9375935")
    expect(result.patreonUserId).toBe("80815623")
    expect(result.patreonRewardId).toBe("9158828")
    expect(result.patreonUserName).toBe("UserName")
});

test('File edition', () => {
    const path = require('path').resolve(__dirname, './_mocks/list.txt')
    fs.unlinkSync(path)
    fs.writeFileSync(path, '', 'utf8')

    updateListFile('Bob', 'RewardName', path);
    expect(fs.readFileSync(path, 'utf8')).toBe("Bob (RewardName)")

    updateListFile('Tom', 'NewRewardName', path);
    expect(fs.readFileSync(path, 'utf8')).toBe("Bob (RewardName)\nTom (NewRewardName)")

    updateListFile('Bob', 'UpgradedReward', path);
    expect(fs.readFileSync(path, 'utf8')).toBe("Tom (NewRewardName)\nBob (UpgradedReward)")

    updateListFile('Tom', 'NewRewardName', path);
    expect(fs.readFileSync(path, 'utf8')).toBe("Bob (UpgradedReward)\nTom (NewRewardName)")

    updateListFile('Bob', null, path);
    expect(fs.readFileSync(path, 'utf8')).toBe("Tom (NewRewardName)")
});