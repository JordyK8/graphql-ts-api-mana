/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose, { Document, Schema } from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  details: String,
  image: String,
},
{ versionKey: false });

interface UProduct {
  name: string,
  price: number,
  details: string,
  image: string,
}

interface IProductModel extends UProduct, Document { }

export interface IProduct extends IProductModel { }

export const Product = mongoose.model<IProductModel>('products', productSchema);
