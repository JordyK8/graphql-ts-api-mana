import mongoose, { Document, Schema } from 'mongoose';
import { IReview, Review } from './Review.schema';
import { User } from './User.schema';

const reviewReplySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    content: {
        type: String,
        required: true,
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
    emojis: [
        { 
            type: String,
            required: false
        }
    ]
},
{ versionKey: false });

interface UReviewReply {
  review: IReview,
  status: number,
}

interface IReviewReplyModel extends UReviewReply, Document {}

export type IReviewReply = IReviewReplyModel

export const ReviewReply = mongoose.model<IReviewReplyModel>('review_replies', reviewReplySchema);
