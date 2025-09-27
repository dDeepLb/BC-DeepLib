export type SettingElement = Button | Checkbox | Input | Label | Custom;

export type BaseElementModel = {
  id: string;
  size?: [width: number | null, height: number | null] | (() => [width: number | null, height: number | null]);
  position?: [x: number, y: number] | (() => [x: number, y: number]);
  disabled?: boolean | (() => boolean);
};

export type Button = Omit<BaseElementModel, 'id'> & {
  id: Parameters<typeof ElementButton.Create>[0];
  type: 'button';
  onClick?: Parameters<typeof ElementButton.Create>[1];
  options?: Parameters<typeof ElementButton.Create>[2];
  htmlOptions?: Parameters<typeof ElementButton.Create>[3];
};

export type Checkbox = BaseElementModel & {
  type: 'checkbox';
  label?: string;
  description?: string;
  setElementValue?: () => boolean;
  setSettingValue?: (val: boolean) => void;
  htmlOptions?: Partial<Record<'container' | 'checkbox' | 'label', Omit<HTMLOptions<any>, 'tag'>>> | null | undefined;
};

export type Input = BaseElementModel & {
  type: 'text' | 'number' | 'color';
  label?: string;
  description?: string;
  setElementValue?: () => string;
  setSettingValue?: (val: string) => void;
  htmlOptions?: Partial<Record<'container' | 'input' | 'label', Omit<HTMLOptions<any>, 'tag'>>> | null | undefined;
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
