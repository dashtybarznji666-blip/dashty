import { v2 as cloudinary } from 'cloudinary';

// Parse CLOUDINARY_URL if provided, otherwise use individual env vars or defaults
let cloudName = 'dr4cddxqo';
let apiKey = '843824483843466';
let apiSecret = 'TYCkgeV-eCzPCAbC0ORZJLoqHqU';

if (process.env.CLOUDINARY_URL) {
  // Parse format: cloudinary://api_key:api_secret@cloud_name
  const urlMatch = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (urlMatch) {
    apiKey = urlMatch[1];
    apiSecret = urlMatch[2];
    cloudName = urlMatch[3];
  }
} else {
  // Use individual environment variables if CLOUDINARY_URL is not set
  cloudName = process.env.CLOUDINARY_CLOUD_NAME || cloudName;
  apiKey = process.env.CLOUDINARY_API_KEY || apiKey;
  apiSecret = process.env.CLOUDINARY_API_SECRET || apiSecret;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;







