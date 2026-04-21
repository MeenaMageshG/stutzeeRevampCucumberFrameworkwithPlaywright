import * as dotenv from 'dotenv';

// ✅ Step 2.1: Load .env file FIRST
dotenv.config();

// ✅ Step 2.2: Read values
export const ENV = {
  BASE_URL: process.env.BASE_URL,
  VALID_USERNAME: process.env.VALID_USERNAME,
  VALID_PASSWORD: process.env.VALID_PASSWORD,
  INVALID_USERNAME: process.env.INVALID_USERNAME,
  INVALID_PASSWORD: process.env.INVALID_PASSWORD,
};

// ✅ Step 2.3: Fail fast if missing
if (!ENV.BASE_URL) {
  throw new Error("❌ BASE_URL is missing in .env file");
}