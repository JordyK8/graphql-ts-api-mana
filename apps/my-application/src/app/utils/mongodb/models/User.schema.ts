// import { accessibleRecordsPlugin } from '@casl/mongoose';
import mongoose, { Document, Schema } from 'mongoose';
import {Crypt, Hash} from '@my-foods2/crypt';

import { IRole, Role } from './Role.schema';
import { Achievement } from './Achievement.schema';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    set: Hash.makeSearchHash
  },
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Achievement,
      required: true,
    },
  ],
  rank: { type: Number , default: 0, required: true },
  password: {
    type: String,
    set: Hash.make,
    required: true
  },
  firstName: {
    type: String,
    get: Crypt.decrypt,
    set: Crypt.encrypt,
    required: true
  },
  lastName: {
    type: String,
    get: Crypt.decrypt,
    set: Crypt.encrypt,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Role,
      required: true
    },
  ]
},
{ versionKey: false });


export interface UUser {
  email: string,
  achievements: string[],
  rank: number,
  password: string,
  firstName: string,
  lastName: string,
  roles: string[],
  image: string,
}

interface IUserModel extends UUser, Document { }

export type IUser = IUserModel
export type IUserInput = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  image: any,
}

export const User = mongoose.model<IUserModel>('users', userSchema);
