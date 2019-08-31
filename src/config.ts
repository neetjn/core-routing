import { IConfig } from './interfaces/config';

export const Config: IConfig = {
  settings: {
    hash: '#!',
    timeout: 5000
  },
  regex: {
    settings: {
      default: /[a-zA-Z0-9]/g,
      fallback: /[a-zA-Z0-9]/g,
      href: /(www|http:|https:)+[^\s]+[\w]/g,
      marker: /[a-zA-Z\-]/g
    },
    routes: {
      variables: /(:(?!qargs)[a-zA-Z]*)/g
    }
  },
  intervals: {
    start: 10,
    fragments: 250
  }
};
