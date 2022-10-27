import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export class Hash {
    /**
     * Hash the given value.
     *
     * @param value
     * @return {string}
     */
    public static make(value: string) {
        
        return bcrypt.hashSync(value, 10);
    }
  
    /**
     * Hashes without salt.
     * This hash is unsafe for passwords and such but good for hashing searchable fields in DB.
     * Will return same hash for same input.
     * @param value
     * @returns {string}
     */
    public static makeSearchHash(value: string): string {
      const secret: any = process.env.SERVER_SECRET;
      return crypto.createHmac('sha256', secret).update(value).digest('hex')
  }


    /**
     * Check the given plain value against a hash.
     *
     * @param value
     * @param hashedValue
     * @return {boolean}
     */
    public static check(value: string, hashedValue: string) {
        return bcrypt.compareSync(value, hashedValue);
    }
}
