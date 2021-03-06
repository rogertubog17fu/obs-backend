import dotenv from 'dotenv';

enum Environment {
  PRODUCTION = 'production',
  STAGING = 'staging',
  TEST = 'test',
  DEVELOPMENT = 'development',
}

function initEnvironment(currentEnvironment: Environment) {
  // Check if NODE_ENV is valid
  const VALID_NODE_ENVIRONMENTS = ['development', 'production'];
  const nodeEnvironment = process.env.NODE_ENV;
  if (nodeEnvironment && !VALID_NODE_ENVIRONMENTS.includes(nodeEnvironment)) {
    throw new Error(`Invalid NODE_ENV value: ${nodeEnvironment}`);
  }

  // Prioritize NODE_ENV
  const appEnvironment = currentEnvironment.toLowerCase() as Environment;

  // Set NODE_ENV to "production" for production-like environments
  switch (appEnvironment) {
    case Environment.PRODUCTION:
    case Environment.STAGING:
      process.env.NODE_ENV = 'production';
      break;
    default:
      process.env.NODE_ENV = 'development';
  }

  // Load dotenv based on app environment
  dotenv.config({
    path: `.env.${appEnvironment}`,
  });

  return {
    APP_ENV: appEnvironment,
    NODE_ENV: nodeEnvironment!,
  };
}

// NOTE: Modify this variable to switch environments during local development
const CURRENT_ENVIRONMENT = Environment.DEVELOPMENT;

const { APP_ENV, NODE_ENV } = initEnvironment(CURRENT_ENVIRONMENT);

/// ///////////////////////////////////////////////////////////////////////////

interface IEnvironmentConfig {
  isProduction: boolean;
  app: {
    environment: string;
    port: number;
  };

  postgresConnectionUrl?: string;
  redisConnectionUrl?: string;
}

export const env: IEnvironmentConfig = {
  isProduction: ['production', 'staging'].includes(NODE_ENV),
  app: {
    environment: APP_ENV,
    port: +process.env.APP_PORT! || 8080,
  },
  postgresConnectionUrl: process.env.POSTGRES_CONNECTION_URL,
  redisConnectionUrl: process.env.REDIS_CONNECTION_URL,
};

// Development environment defaults
if (APP_ENV === Environment.DEVELOPMENT || APP_ENV === Environment.PRODUCTION) {
  env.postgresConnectionUrl = 'postgresql://postgres:password@db:5432/db';
  env.redisConnectionUrl = 'redis://redis';
}

console.info(`${'='.repeat(40)}`);
console.info(`Current Environment: ${env.app.environment}`);
console.info(`${'='.repeat(40)}`);

/// ///////////////////////////////////////////////////////////////////////////
