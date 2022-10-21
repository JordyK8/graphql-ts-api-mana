export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ProductsDataClient {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
}

export const exampleProducts: Record<string, Product> = {
  '1': { id: '1', name: 'Product 1', price: 100 },
  '2': { id: '2', name: 'Product 2', price: 200 },
};

export function createProductsDataClient(): ProductsDataClient {
  return {
    getProducts() {
      return Promise.resolve(Object.values(exampleProducts));
    },
    getProductById(id) {
      return Promise.resolve(exampleProducts[id]);
    },
  };
}