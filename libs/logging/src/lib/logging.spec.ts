import { logging } from './logging';

describe('logging', () => {
  it('should work', () => {
    expect(logging.info("hoi")).toBeCalled();
  });
});
