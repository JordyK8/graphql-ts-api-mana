import { rabbitmq } from './rabbitmq';

describe('rabbitmq', () => {
    it('should work', () => {
        expect(rabbitmq()).toEqual('rabbitmq');
    });
});
