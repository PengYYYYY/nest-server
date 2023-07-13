import type { Config } from './config.interface';

const config = {
  nest: {
    port: 7001,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs Server',
    description: 'The nestjs API description',
    version: '1.0',
    path: 'api',
  },
  security: {
    expiresIn: '2h',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
