export interface VariableParam {
  title: string;
  delta?: string | number;
  hex?: string;
  value?: string;
}

export type VariableCollection = VariableParam[];

export interface MaskItem {
  key: string;
  mask: string;
}

export type MaskCollection = MaskItem[];
