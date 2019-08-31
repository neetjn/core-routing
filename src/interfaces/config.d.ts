interface ISettings {
  hash: string;
  timeout: number;
}

interface IRegex {
  settings: {
    default: RegExp;
    fallback: RegExp;
    href: RegExp;
    marker: RegExp;
  }
  routes: {
    variables: RegExp;
  }
}

interface IIntervals {
  start: number;
  fragments: number;
}

export interface IConfig {
  settings: ISettings;
  regex: IRegex;
  intervals: IIntervals;
}
