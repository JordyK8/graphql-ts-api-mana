/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose, { Document, Schema } from 'mongoose';
import { IReview, Review } from './User.schema';

const businessSchema = new mongoose.Schema({
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Review,
      required: true
    },
  ],
  name: {
    type: String,
    required: true,
  },
  links: [
    { 
      name: {
        type: String,
        required: false,
      },
      link: {
        type: String,
        required: false
      }
    }
  ],

},
{ versionKey: false });

interface UBusiness {
  reviews: IReview[],
  user: string,
  status: number,
}

interface IBusinessModel extends UBusiness, Document {}

export interface IBusiness extends IBusinessModel { }

export const Business = mongoose.model<IBusinessModel>('businesses', businessSchema);
