import { misc } from "@my-foods2/variables";

export function determineUpdateFields(schemaName: string, item: any) {
    if(!Object.prototype.hasOwnProperty.call(schemaName, schemaName)) throw new Error(`No variables found for updatable fields for ${schemaName}`);
    return Object.keys(item).reduce((acc: any, i) => {
        if(!misc.updatableFields[schemaName as keyof typeof misc.updatableFields].includes(i)) return acc;
        acc[i] = item[i];
    }, {})
    
}