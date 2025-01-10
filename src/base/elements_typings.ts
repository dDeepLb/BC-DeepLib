export type SettingElement = Button | Checkbox | Input | Label | Custom;

export type BaseElementModel = {
  id: string;
  size?: [width: number | null, height: number | null] | (() => [width: number | null, height: number | null]);
  position?: [x: number, y: number] | (() => [x: number, y: number]);
  disabled?: boolean | (() => boolean);
};

type CustomButtonOptions = {
  id?: Parameters<typeof ElementButton.Create>[0];
  onClick?: Parameters<typeof ElementButton.Create>[1];
  options?: Parameters<typeof ElementButton.Create>[2];
  htmlOptions?: Parameters<typeof ElementButton.Create>[3];
};

export type Button = BaseElementModel & {
  type: 'button';
  image?: string;
  label?: string;
  tooltip?: string;
  onClick?: () => void;
  htmlOptions?: CustomButtonOptions;
};

export type Checkbox = BaseElementModel & {
  type: 'checkbox';
  label?: string;
  description?: string;
  getSettingValue?: () => boolean;
  setSettingValue?: (val: boolean) => void;
  htmlOptions?: Omit<HTMLOptions<any>, 'tag'>;
};

export type Input = BaseElementModel & {
  type: 'text' | 'number';
  label?: string;
  description?: string;
  getElementValue?: () => string;
  setSettingValue?: (val: string) => void;
  htmlOptions?: Omit<HTMLOptions<any>, 'tag'>;
};

export type Label = BaseElementModel & {
  type: 'label';
  label?: string;
  description?: string;
  htmlOptions?: Omit<HTMLOptions<any>, 'tag'>;
};

export type Custom = BaseElementModel & {
  type: 'custom';
  htmlOptions: HTMLOptions<keyof HTMLElementTagNameMap>;
};
