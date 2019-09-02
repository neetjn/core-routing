import { IConfig } from './interfaces/config';

export const Config: IConfig = {
  settings: {
    hash: '#!',
    timeout: 5000
  },
  regex: {
    settings: {
      default: /[a-zA-Z0-9]/g,
      href: /(www|http:|https:)+[^\s]+[\w]/g,
    },
    routes: {
      variables: /(:(?!qargs)[a-zA-Z]*)/g
    }
  },
  intervals: {
    start: 10,
    listener: 250,
    fragments: 250
  }
};
