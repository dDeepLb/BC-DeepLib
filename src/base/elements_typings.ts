export type SettingElement = Button | Checkbox | Input | Label | Dropdown | Custom;

export type BaseElementModel = {
  id: string;
  size?: [width: number | null, height: number | null] | (() => [width: number | null, height: number | null]);
  position?: [x: number, y: number] | (() => [x: number, y: number]);
  disabled?: boolean | (() => boolean);
};

export type Button = Prettify<{
  id: Parameters<typeof ElementButton.Create>[0];
  type: 'button';
  onClick?: Parameters<typeof ElementButton.Create>[1];
  options?: Parameters<typeof ElementButton.Create>[2];
  htmlOptions?: Parameters<typeof ElementButton.Create>[3];
} & Omit<BaseElementModel, 'id'>>;

export type Checkbox = Prettify<{
  type: 'checkbox';
  label?: string;
  description?: string;
  setElementValue?: () => boolean;
  setSettingValue?: (val: boolean) => void;
  htmlOptions?: Partial<Record<'container' | 'checkbox' | 'label', Omit<HTMLOptions<any>, 'tag'>>> | null | undefined;
} & BaseElementModel>;

export type Input = Prettify<{
  type: 'text' | 'number' | 'color';
  label?: string;
  description?: string;
  setElementValue?: () => string;
  setSettingValue?: (val: string) => void;
  htmlOptions?: Partial<Record<'container' | 'input' | 'label', Omit<HTMLOptions<any>, 'tag'>>> | null | undefined;
} & BaseElementModel>;

export type Dropdown = Prettify<{
  id: Parameters<typeof ElementCreateDropdown>[0];
  type: 'dropdown';
  label?: string;
  description?: string;
  optionsList: Parameters<typeof ElementCreateDropdown>[1];
  setElementValue?: () => string;
  setSettingValue?: (val: string) => void;
  options?: Parameters<typeof ElementCreateDropdown>[3];
  htmlOptions?: {
    container?: Partial<Omit<HTMLOptions<any>, 'tag'>>
    select?: Parameters<typeof ElementCreateDropdown>[4];
    label?: Partial<Omit<HTMLOptions<'label'>, 'tag'>>;
  };
} & Omit<BaseElementModel, 'id' | 'disabled'>>;

export type Label = Prettify<{
  type: 'label';
  label?: string;
  description?: string;
  htmlOptions?: Omit<HTMLOptions<any>, 'tag'>;
} & BaseElementModel>;

export type Custom = Prettify<{
  type: 'custom';
  htmlOptions: HTMLOptions<keyof HTMLElementTagNameMap>;
} & BaseElementModel>;
