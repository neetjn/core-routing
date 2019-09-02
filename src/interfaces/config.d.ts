interface ISettings {
  hash: string;
  useFragments: boolean;
  memoizeLocalStorage;
}

interface IRegex {
  settings: {
    default: RegExp;
    href: RegExp;
  }
  routes: {
    variables: RegExp;
  }
}

interface IIntervals {
  start: number;
  listener: number;
  fragments: number;
}

export interface IConfig {
  settings: ISettings;
  regex: IRegex;
  intervals: IIntervals;
}
