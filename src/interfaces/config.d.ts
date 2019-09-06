interface ISettings {
  hash: string;
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
}

export interface IConfig {
  settings: ISettings;
  regex: IRegex;
  intervals: IIntervals;
}
