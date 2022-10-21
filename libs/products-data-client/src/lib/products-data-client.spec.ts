import { productsDataClient } from './products-data-client';

describe('productsDataClient', () => {
  it('should work', () => {
    expect(productsDataClient()).toEqual('products-data-client');
  });
});
