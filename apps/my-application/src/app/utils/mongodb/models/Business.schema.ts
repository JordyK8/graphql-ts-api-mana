/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose, { Document, Schema } from 'mongoose';
import { IReview, Review } from './Review.schema';

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
    page: {
        settings: {
            template: { type: Number, default: 1 },
        }
    },
    locations: [
        { 
            name: { type: String, required: true },
            address: {
                postalCode: { type: String, required: true },
                city: { type: String, required: true },
                street:  { type: String, required: true },
                houseNubmer:  { type: Number, required: true },
                houseNubmerAddition:  { type: String, required: false },
            }
        }
    ],

},
    { versionKey: false });

interface UBusiness {
    reviews: IReview[],
    name: string,
    links: { link: string, name: string }[],
    page: { settings: { template: number } },
    locations: { 
        name: string,
        address: {
            postalCode: string,
            city: string,
            street:  string,
            houseNubmer: number,
            houseNubmerAddition: string,
        }
    }[]
}

interface IBusinessModel extends UBusiness, Document { }

export type IBusiness = IBusinessModel

export const Business = mongoose.model<IBusinessModel>('businesses', businessSchema);
