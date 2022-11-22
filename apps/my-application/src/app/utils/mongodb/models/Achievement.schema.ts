/* graphql-server-boilerplate
Copyright (c) 2019-present NAVER Corp.
MIT license */
import mongoose, { Document, Schema } from 'mongoose';
import { IReview, Review } from './Review.schema';

const achievementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    units: { type: Number, required: true },
    dataField: { type: String, required: true },
},
    { versionKey: false });

interface UAchievement{
    name: string,
    value: number,
    units: number,
    dataField: string,
}

export type IAchievementInput = {
    name: string,
    value: number,
    units: number,
    dataField: string,
}

interface IAchievementModel extends UAchievement, Document { }

export type IBusiness = IAchievementModel

export const Achievement = mongoose.model<IAchievementModel>('achievements', achievementSchema);
