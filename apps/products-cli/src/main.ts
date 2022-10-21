import { createProductsDataClient } from '@my-foods2/products-data-client';
import * as constants from "@my-foods2/variables";
main();

async function main() {
  console.log(constants.app.SERVER_SECRET);
  
  const productsDataClient = createProductsDataClient();
  const id = getProvidedId();
  if (id != null) {
    const product = await productsDataClient.getProductById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    console.log(JSON.stringify(product, null, 2));
  } else {
    const products = await productsDataClient.getProducts();
    console.log(JSON.stringify(products, null, 2));
  }
}

function getProvidedId() {
  return process.argv[2];
}