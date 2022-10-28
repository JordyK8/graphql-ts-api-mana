/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose, { Document, Schema } from 'mongoose';
import { ReviewReply } from './ReviewReply.schema';
import { IUser, User } from './User.schema';

const reviewSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        service: {
            type: Number,
            required: true,
        },
        taste: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    images: [
        {
            description: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ReviewReply,
            required: false
        }
    ],
    emojis: [
        {
            type: String,
            required: false
        }
    ]
},

    { versionKey: false });

interface UReview {
    user: IUser,
    status: number,
}

interface IReviewModel extends UReview, Document { }

export type IReview = IReviewModel

export const Review = mongoose.model<IReviewModel>('reviews', reviewSchema);
