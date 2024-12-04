export type SettingElement = Button | Checkbox | Input | Label;

export type BaseElementModel = {
  id: string;
  size?: [width: number, height: number];
  position?: [x: number, y: number];
  disabled?: boolean;
};

export type Button = BaseElementModel & {
  type: 'button';
  image?: string;
  label?: string;
  tooltip?: string;
  onClick: () => void;
};

export type Checkbox = BaseElementModel & {
  type: 'checkbox';
  label: string;
  description: string;
  getSettingValue: () => boolean;
  setSettingValue: (val: boolean) => void;
};

export type Input = BaseElementModel & {
  type: 'text' | 'number';
  label: string;
  description: string;
  getElementValue: () => string;
  setSettingValue: (val: string) => void;
};

export type Label = BaseElementModel & {
  type: 'label';
  label: string;
  description?: string;
};
