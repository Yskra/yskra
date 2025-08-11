export interface ListItem {
  name: string;
  url: string;
  group: string | '__UNKNOWN__';
  id: string;
  listUrl: string;
  tvgLogo?: string;
  tvgName?: string;
  tvgRec?: string;
}

export type List = ListItem[];
