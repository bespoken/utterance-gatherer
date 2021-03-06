import * as fs from 'fs';
import { S3 } from 'aws-sdk';

require('dotenv').config();

export type CommonVoiceConfig = {
  VERSION: string;
  PROD: boolean;
  SERVER_PORT: number;
  DB_ROOT_USER: string;
  DB_ROOT_PASS: string;
  MYSQLUSER: string;
  MYSQLPASS: string;
  MYSQLDBNAME: string;
  MYSQLHOST: string;
  MYSQLPORT: number;
  BUCKET_NAME: string;
  BUCKET_LOCATION: string;
  ENVIRONMENT: string;
  RELEASE_VERSION?: string;
  SECRET: string;
  S3_CONFIG: S3.Types.ClientConfiguration;
  ADMIN_EMAILS: string;
  AUTH0: {
    DOMAIN: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
  BASKET_API_KEY?: string;
  IMPORT_SENTENCES: boolean;
  REDIS_URL: string;
  BUCKET_SENTENCES_NAME: string;
  ENCRYPT_SECRET_KEY: string;
};

const DEFAULTS: CommonVoiceConfig = {
  VERSION: null, // Migration number (e.g. 20171205171637), null = most recent
  RELEASE_VERSION: null, // release version set by nubis,
  PROD: false, // Set to true for staging and production.
  SERVER_PORT: 3000,
  DB_ROOT_USER: process.env.DB_ROOT_USER || 'root', // For running schema migrations.
  DB_ROOT_PASS: process.env.DB_ROOT_PASS || '',
  MYSQLUSER: 'voicecommons', // For normal DB interactions.
  MYSQLPASS: 'voicecommons',
  MYSQLDBNAME: 'voiceweb',
  MYSQLHOST: process.env.MYSQLHOST || 'localhost',
  MYSQLPORT: 3306,
  BUCKET_NAME: process.env.BUCKET_NAME || 'common-voice-corpus',
  BUCKET_LOCATION: '',
  ENVIRONMENT: 'default',
  SECRET: 'TODO: Set a secure SECRET in config.json',
  ADMIN_EMAILS: '[]', // array of admin emails, as JSON
  S3_CONFIG: {
    signatureVersion: 'v4',
    useDualstack: true,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  AUTH0: {
    DOMAIN: '',
    CLIENT_ID: '',
    CLIENT_SECRET: '',
  },
  IMPORT_SENTENCES: true,
  REDIS_URL: null,
  BUCKET_SENTENCES_NAME: process.env.BUCKET_SENTENCES_NAME || '',
  ENCRYPT_SECRET_KEY: process.env.ENCRYPT_SECRET_KEY || '',
};

let injectedConfig: CommonVoiceConfig;

export function injectConfig(config: any) {
  injectedConfig = { ...DEFAULTS, ...config };
}

let loadedConfig: CommonVoiceConfig;

export function getConfig(): CommonVoiceConfig {
  if (injectedConfig) {
    return injectedConfig;
  }

  if (loadedConfig) {
    return loadedConfig;
  }

  return { ...DEFAULTS };
}
