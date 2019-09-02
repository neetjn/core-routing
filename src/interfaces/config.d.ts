interface ISettings {
  hash: string;
  timeout: number;
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
