// import { accessibleRecordsPlugin } from '@casl/mongoose';
import mongoose, { Document, Schema } from 'mongoose';
import {Crypt, Hash} from '@my-foods2/crypt';

import { IRole, Role } from './Role.schema';
import { Business } from './Business.schema';

const businessUserSchema = new mongoose.Schema({
  email: {
    type: String,
    set: Hash.makeSearchHash
  },
  password: {
    type: String,
    set: Hash.make,
    required: true
  },
  firstName: {
    type: String,
    // get: Crypt.decrypt,
    // set: Crypt.encrypt,
    required: true
  },
  lastName: {
    type: String,
    // get: Crypt.decrypt,
    // set: Crypt.encrypt,
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
  ],
  businesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Business,
      required: true
    }
  ]
},
{ versionKey: false });


export interface UBusinessUser {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  roles: string[],
  image: string,
  businesses?: string[]
}

interface IBusinessUserModel extends UBusinessUser, Document { }

export type IBusinessUser = IBusinessUserModel
export type IBusinessUserInput = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  image?: any,
  businesses?: string[]
}

export const BusinessUser = mongoose.model<IBusinessUserModel>('business_users', businessUserSchema);
