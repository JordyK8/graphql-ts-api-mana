import dotenv from 'dotenv'

dotenv.config();

export default {

  timezone: 'Europe/Amsterdam',
  locale: 'en',
  encryption: {
    key: process.env.APP_KEY,
    cipher: 'AES-256-CBC',
    sha: 'sha256',
  },
}
