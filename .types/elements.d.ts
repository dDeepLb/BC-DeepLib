export type SettingElement = Button | Checkbox | Input | Label;

export type BaseElementModel = {
  id: string;
  position?: [number, number];
  size?: [number, number];
  disabled?: boolean;
};

export type Button = BaseElementModel & {
  type: 'button';
  image?: string;
  label?: string;
  hoverHint?: string;
  onClick: () => void;
};

export type Checkbox = BaseElementModel & {
  type: 'checkbox';
  label: string;
  description: string;
  setElementValue: () => any;
  setSettingValue: (val: any) => void;
};

export type Input = BaseElementModel & {
  type: 'text' | 'number';
  label: string;
  description: string;
  setElementValue: () => any;
  setSettingValue: (val: any) => void;
};

export type Label = BaseElementModel & {
  type: 'label';
  label: string;
  description?: string;
};
