import nodeFetch from 'node-fetch'

describe('*** confirmEmail test suite', () => {
    it('should return invalid', async () => {
        const res = await nodeFetch(
            `${process.env.TEST_HOST}/confirm/cavapasmarcherfrer`
        )
        const text = await res.text()
        expect(text).toBe('invalid')
    })
})
