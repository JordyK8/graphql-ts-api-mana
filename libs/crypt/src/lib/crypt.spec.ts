import { crypt } from './crypt';

describe('crypt', () => {
    it('should work', () => {
        expect(crypt()).toEqual('crypt');
    });
});
