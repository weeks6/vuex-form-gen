import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "vue";

export type GenFormData = {
  [key: string]: {
    value: any;
    errors?: ErrorMessage[];
  };
};

export type ErrorMessage = string;

/**
 * * eager - validates on every change
 * * blur - on input blur
 * * lazy - validates only on submit
 */
export type ValidationMode = "eager" | "blur" | "lazy";
export type Validator = (
  value: any,
  formData: GenFormData,
) => ErrorMessage | undefined;

export type FieldType = "input" | "checkbox" | "select" | "textarea";

type FieldAttrsMap = {
  input: InputHTMLAttributes;
  checkbox: InputHTMLAttributes;
  select: SelectHTMLAttributes;
  textarea: TextareaHTMLAttributes;
};

export type SelectOption = {
  id?: any;
  value: any;
  title?: any;
};

type SelectProps = {
  options: SelectOption[] | (string | number)[];
};

type TypeWithAttrs<T extends FieldType = FieldType> = {
  type: T;
  attrs?: FieldAttrsMap[T];
} & (T extends "select" ? SelectProps : {});

export type Field = {
  name: string;
  label?: {
    text: string;
    attrs?: LabelHTMLAttributes;
  };
  validators?: Validator[];
  validtionMode?: ValidationMode;
} & (
  | TypeWithAttrs<"input">
  | TypeWithAttrs<"checkbox">
  | TypeWithAttrs<"select">
  | TypeWithAttrs<"textarea">
);

export type GenFormConfig = {
  fields: Field[];
};
