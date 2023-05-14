const { _parsePayload } = require('./patreon-hooks')

test('Testing payload parse', () => {
    const data = require('./_mocks/data.json')
    const result = _parsePayload(data)
    expect(result.patreonCampainId).toBe("9375935")
    expect(result.patreonUserId).toBe("80815623")
    expect(result.patreonRewardId).toBe("9158828")
    expect(result.patreonUserName).toBe("UserName")
});
