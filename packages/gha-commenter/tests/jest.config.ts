import { Config } from '@jest/types';
import rootConfig from '../../../jest.config';

const config: Config.InitialOptions = {
  ...rootConfig,
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/../src/$1',
    '~/(.*)$': '<rootDir>/../$1',
  },
};

export default config;
