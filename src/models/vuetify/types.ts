import { Ref } from "vue";
import { Density } from "./vuetifyTypes";
import { VBtn, VCheckboxTypes, VFormInputTypes, VFormSelectTypes } from "./vuetify-components";
import { IFields } from "../basic";

export interface IToggleIconButtons {
  label?: string;
  divided?: boolean;
  tabs?: FormBtn[];
  modelValue?: any;
  color?: string;
  mandatory?: boolean;
  visible?: boolean;
}

export interface FormBtn extends VBtn {
  label?: string;
  icon?: any;
  visible?: any;
  key?: any;
  value?: any;
}

export interface ITable {
  fields: IFields[];
  filter?: any;
  customInterface?: unknown;
  service?: any;
  routerName?: string;
  permission?: string;
  hasPagination?: boolean;
  manualRefresh?: boolean;
  apiName?: string;
  tableHeight?: string;
  resData?: string;
  density?: Density;
  fixedHeader?: boolean;
  fixedFooter?: boolean;
  hover?: boolean;
  tableClass?: string;
  removeKeys?: string[];
  tableRef?: Ref;
  params?: any;
  // isDanger?: boolean;
  identifier?: boolean;
  appendAction?: boolean;
  prependAction?: boolean;
  noData?: boolean;
}

export interface CheckboxTypes extends VCheckboxTypes {
  required?: boolean;
  type?: "checkbox" | "radio";
  group?: boolean;
}

export interface FormInputTypes extends VFormInputTypes {
  required?: boolean;
  max?: number | string | null | undefined;
  min?: number | string | null | undefined;
  minValue?: number | string | null | undefined;
  maxValue?: number | string | null | undefined;
}

export interface FormSelectTypes extends VFormSelectTypes {
  required?: boolean;
}
