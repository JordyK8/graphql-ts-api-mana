// import { accessibleRecordsPlugin } from '@casl/mongoose';
import mongoose, { Document, Schema } from 'mongoose';
import Crypt from '../../Crypt/encryption';
import Hash from '../../Crypt/hashing';
import { IRole, Role } from './Role.schema';

const userSchema = new mongoose.Schema({
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
  ]
},
{ versionKey: false });


export interface UUser {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  roles: string[],
  image: string,
}

interface IUserModel extends UUser, Document { }

export interface IUser extends IUserModel { }

export const User = mongoose.model<IUserModel>('users', userSchema);
