import {
  createProductsDataClient,
  exampleProducts,
} from './products-data-client';

describe('productsDataClient', () => {
  it('should get all example products', async () => {
    const productsDataClient = createProductsDataClient();
    const products = await productsDataClient.getProducts();
    expect(products).toEqual(Object.values(exampleProducts));
  });

  it('should get example product by id', async () => {
    const productsDataClient = createProductsDataClient();
    const product = await productsDataClient.getProductById('1');
    expect(product).toEqual(exampleProducts['1']);
  });
})