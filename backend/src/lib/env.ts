/**
 * Environment variable validation and configuration
 */

interface EnvConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  frontendUrl: string;
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

/**
 * Validate required environment variables
 */
function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Required variables
  const port = parseInt(process.env.PORT || '3001', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';
  let databaseUrl = process.env.DATABASE_URL;
  let jwtSecret = process.env.JWT_SECRET;
  let jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  // Check required variables
  if (!databaseUrl) {
    if (nodeEnv === 'development') {
      console.warn('⚠️  WARNING: DATABASE_URL not set, using default SQLite database');
      databaseUrl = 'file:./prisma/prisma/dev.db';
    } else {
      errors.push('DATABASE_URL is required');
    }
  }

  // In development, use default secrets if not provided (with warning)
  if (!jwtSecret) {
    if (nodeEnv === 'development') {
      console.warn('⚠️  WARNING: JWT_SECRET not set, using default (INSECURE FOR PRODUCTION)');
      jwtSecret = 'default-jwt-secret-key-for-development-only-change-in-production-min-32-chars';
    } else {
      errors.push('JWT_SECRET is required');
    }
  } else if (jwtSecret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  if (!jwtRefreshSecret) {
    if (nodeEnv === 'development') {
      console.warn('⚠️  WARNING: JWT_REFRESH_SECRET not set, using default (INSECURE FOR PRODUCTION)');
      jwtRefreshSecret = 'default-refresh-secret-key-for-development-only-change-in-production-min-32-chars';
    } else {
      errors.push('JWT_REFRESH_SECRET is required');
    }
  } else if (jwtRefreshSecret.length < 32) {
    errors.push('JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach((error) => console.error(`  - ${error}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('See .env.example for reference.');
    process.exit(1);
  }

  // Optional Cloudinary configuration
  let cloudinary: EnvConfig['cloudinary'] | undefined;
  if (process.env.CLOUDINARY_URL) {
    const urlMatch = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (urlMatch) {
      cloudinary = {
        apiKey: urlMatch[1],
        apiSecret: urlMatch[2],
        cloudName: urlMatch[3],
      };
    }
  } else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    };
  }

  return {
    port,
    nodeEnv,
    databaseUrl: databaseUrl!, // Non-null assertion - we've validated it above
    jwtSecret: jwtSecret!, // Non-null assertion - we've validated it above
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshSecret: jwtRefreshSecret!, // Non-null assertion - we've validated it above
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    cloudinary,
  };
}

export const env = validateEnv();

