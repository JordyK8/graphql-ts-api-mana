/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose, { Document, Schema } from 'mongoose';
import { IProduct, Product } from './Product.schema';
import { IUser, User } from './User.schema';

const orderSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true
    },
  ],
  status: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: false
  },
  email: {
    type: String,
    reguired: true
  }
},
{ versionKey: false });

interface UOrder {
  items: string[],
  user: string,
  status: number,
}

interface IOrderModel extends UOrder, Document {}

export interface IOrder extends IOrderModel { }

export const Order = mongoose.model<IOrderModel>('orders', orderSchema);
