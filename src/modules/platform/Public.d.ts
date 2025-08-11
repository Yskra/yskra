export interface Platform {
  browser: string | undefined;
  version: number | 1;
  os: {
    family: string | undefined;
    version: number | 1;
  };
  isTV: boolean;
}
