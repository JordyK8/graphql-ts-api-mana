// import { accessibleRecordsPlugin } from '@casl/mongoose';
import mongoose, { Document, Schema } from 'mongoose';
import {Crypt, Hash} from '@my-foods2/crypt';

import { IRole, Role } from './Role.schema';
import { Business } from './Business.schema';

const adminUserSchema = new mongoose.Schema({
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


export interface UAdminUser {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  roles: string[],
  image: string,
}

interface IAdminUserModel extends UAdminUser, Document { }

export type IAdminUser = IAdminUserModel
export type IAdminUserInput = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  image: any,
  businesses: string[]
}

export const AdminUser = mongoose.model<IAdminUserModel>('admin_users', adminUserSchema);
