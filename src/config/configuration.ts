import path from 'path';

// import dotenv from 'dotenv-safe';
import { BuildType } from '../enum/buildType';

console.log(process.env['PORT']);

const requireProcessEnv = (name: string): string => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name]!;
};

// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config({
//     path: path.join(__dirname, '../../.env'),
//     example: path.join(__dirname, '../../.env.example'),
//   });
// }

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    ip: process.env.IP || 'localhost',
    protocol: process.env.PROTOCOL || 'http',
    client_ip: process.env.CLIENT_IP || 'localhost',
    client_port: process.env.CLIENT_PORT || '4200',
    client_protocol: process.env.CLIENT_PROTOCOL || 'http',
    apiRoot: process.env.API_ROOT || '',
    defaultEmail: 'vtkp2002dn@gmail.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    FACEBOOK_APP_ID: requireProcessEnv('FACEBOOK_APP_ID'),
    FACEBOOK_APP_SECRET: requireProcessEnv('FACEBOOK_APP_SECRET'),
    GOOGLE_APP_ID: requireProcessEnv('GOOGLE_APP_ID'),
    GOOGLE_APP_SECRET: requireProcessEnv('GOOGLE_APP_SECRET'),
    GITHUB_APP_ID: requireProcessEnv('GITHUB_APP_ID'),
    GITHUB_APP_SECRET: requireProcessEnv('GITHUB_APP_SECRET'),
    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      },
    },
    APP_ID: process.env.APPID || null,
    APP_KEY: process.env.APPKEY || null,
  },
  test: {},
  development: {
    mongo: {
      uri: process.env.MONGODB_URI!,
      options: {
        debug: true,
      },
    },
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI!,
    },
  },
};

console.log(config);

const envConfig =
  config.all.env === BuildType.production
    ? config.production
    : config.development;

export default () => ({ ...config.all, ...envConfig });
