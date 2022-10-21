
import mongoose, { Document, Schema } from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  permissions: [{
    type: {
      type: String,
      required: true
    },
    level:
    {
      type: Number,
      required: true,
    }
  }],
},
{ versionKey: false });

interface URole {
  name: string,
  permissions: [{
    type: string,
    level: number,
  }]
}

interface IRoleModel extends URole, Document {}
export interface IRole extends IRoleModel { }
export const Role = mongoose.model<IRoleModel>('roles', roleSchema);
