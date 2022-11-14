import { User } from "../utils/mongodb/models/User.schema"

export async function checkPermissions(_id: string, reqType: string, reqLevel: number): Promise<boolean> {
  console.log('middle waare check permissions');
  
  const user = await User.findOne({ _id }).populate('roles');
  if (!user) return false;
  return user.roles.reduce((acc: any, role: any) => {
    const index = role.permissions.findIndex((i: any) => i.type === reqType);
    console.log(index);
    if (index < 0) return acc;
    if (role.permissions[index].level >= reqLevel) acc = true;
    return acc; 
  }, false)
}
